import ping from 'ping';
import { ClientWithServerStatus } from '../types';
import { PENDING_SHUTDOWN, SERVER_OFFLINE, SERVER_ONLINE, SERVER_PENDING, SERVER_TURNING_OFF } from '../constants';
import { PresenceStatusData, TextChannel } from 'discord.js';
import moment from 'moment';
import SSH from 'simple-ssh';
import {
    bootGraceIn,
    controlChannel,
    controlGuild,
    serverAddress,
    shutdownIn,
    sshPassword,
    sshUsername,
} from '../envVars';

import { timeToWordFormat } from '../utils';
import { armaGetPlayers, minecraftGetPlayers } from './getPlayerCount';

const getPlayerCountMap = {
    minecraft: minecraftGetPlayers,
    arma3: armaGetPlayers,
};

export const checkServer = async (client: ClientWithServerStatus) => {
    const pingResp = await ping.promise.probe(serverAddress);

    if (!pingResp.alive) {
        await serverOffline(client);
    } else {
        await serverOnline(client);
    }
};

const serverOffline = async (client: ClientWithServerStatus) => {
    if (client.serverStatus !== SERVER_OFFLINE) {
        console.log('Server is offline');
        await sendMessage(client, 'Server is now offline. Use /wake to turn it on.');
        await setPresence(client, 'Offline', 'dnd');
        client.serverStatus = SERVER_OFFLINE;
        client.bootGracePeriod = undefined;
    }
};

const serverOnline = async (client: ClientWithServerStatus) => {
    const playerCount = await getPlayers(client);
    if (playerCount === 0 && client.serverStatus !== SERVER_PENDING && client.serverStatus !== SERVER_OFFLINE) {
        await handleZeroPlayers(client, playerCount);
    } else if (client.serverStatus === SERVER_PENDING || client.serverStatus === SERVER_OFFLINE)
        await handleServerCameOnline(client, playerCount);
    else if (client.playerCount !== playerCount) {
        if (client.serverStatus !== SERVER_ONLINE) await handleServerCameOnline(client, playerCount);
        else await setPlayerCountPresence(client, playerCount);
    }
    if (playerCount !== 0) client.turnOffTime = undefined;
};

const getPlayers = async (client: ClientWithServerStatus) => {
    const getPlayerCountFn = getPlayerCountMap[(client.profile as keyof typeof getPlayerCountMap) || ''];
    if (typeof getPlayerCountFn === undefined) {
        console.error(`Unable to get profile - ${client.profile}`);
        return 0;
    }
    return await getPlayerCountFn();
};

const setPlayerCountPresence = async (client: ClientWithServerStatus, playerCount: number) => {
    console.log('Updating player count');
    await setPresence(client, `Online - ${playerCount}`, 'online');
    client.playerCount = playerCount;
};

const handleServerCameOnline = async (client: ClientWithServerStatus, playerCount: number) => {
    console.log('Server is now online');
    const now = new Date();

    if ([SERVER_PENDING, SERVER_OFFLINE].includes(client.serverStatus || '')) {
        const bootGracePeriod = moment(now).add({ seconds: bootGraceIn });
        client.bootGracePeriod = bootGracePeriod.toDate();
        await sendMessage(client, 'Server is now online.');
    }
    client.serverStatus = SERVER_ONLINE;

    await setPlayerCountPresence(client, playerCount);
};

const handleZeroPlayers = async (client: ClientWithServerStatus, playerCount: number) => {
    const now = new Date();

    client.playerCount = playerCount;

    if (client.bootGracePeriod && now < client.bootGracePeriod) {
        console.log(`Server is empty but in grace period. Grace period lasts until ${client.bootGracePeriod}`);
        await setPlayerCountPresence(client, playerCount);
        return;
    }

    client.serverStatus = PENDING_SHUTDOWN;
    if (!client.turnOffTime) {
        console.log('Server is empty, starting shutdown timer');
        const shutdownDateTime = moment(now).add(shutdownIn, 'seconds');
        client.turnOffTime = shutdownDateTime.toDate();

        await sendMessage(
            client,
            `Server is empty, shutting down in ${shutdownIn > 60 ? shutdownIn / 60 : shutdownIn} ${timeToWordFormat(
                shutdownIn,
            )}.`,
        );
        await setPresence(client, `Shutting down at ${shutdownDateTime.format('hh:mm:ss')}`, 'idle');
        return;
    }

    if (now > client.turnOffTime && client.serverStatus !== SERVER_TURNING_OFF) {
        console.log('Server shutting down');
        try {
            await turnServerOff(client);
        } catch (err) {
            console.error(err);
            await sendMessage(client, String(err));
        }
        return;
    }
};

const turnServerOff = async (client: ClientWithServerStatus) => {
    console.log('Turning server off');
    client.serverStatus = SERVER_TURNING_OFF;
    try {
        const ssh = new SSH({
            host: serverAddress,
            user: sshUsername,
            pass: sshPassword,
        });
        ssh.exec('sudo bash ./shutdown.sh', {
            pty: true,
            out: console.log.bind(console),
            exit(code, stdout, stderr) {
                console.log(code, stdout, stderr);
            },
        });
        ssh.start();

        await setPresence(client, 'Server turning off...', 'dnd');
    } catch (err) {
        console.error(err);
        await sendMessage(client, `Error shutting server down! ${err}`);
    }
};

const sendMessage = async (client: ClientWithServerStatus, message: string) => {
    const guild = await client.guilds.fetch(controlGuild);
    const channel = await guild.channels.fetch(controlChannel);

    if (channel?.isTextBased()) {
        await (channel as TextChannel).send(message);
    } else {
        console.error('Control channel is not text based?');
    }
};

const setPresence = async (
    client: ClientWithServerStatus,
    presenceText: string,
    presenceStatus: PresenceStatusData,
) => {
    await client.user?.setPresence({
        activities: [
            {
                name: presenceText,
            },
        ],
        status: presenceStatus as PresenceStatusData,
    });
};
