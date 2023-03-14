import ping from 'ping';
import { ClientWithServerStatus } from '../types';
import { PENDING_SHUTDOWN, SERVER_OFFLINE, SERVER_ONLINE, SERVER_TURNING_OFF } from '../constants';
import { PresenceStatusData, TextChannel } from 'discord.js';
import moment from 'moment';
import SSH from 'simple-ssh';
import {
    botGraceIn,
    controlChannel,
    controlGuild,
    rconPassword,
    rconPort,
    serverAddress,
    shutdownIn,
    sshPassword,
    sshUsername,
} from '../envVars';
// @ts-ignore
import A3Rcon from 'arma3-rcon';

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
    }
};

const serverOnline = async (client: ClientWithServerStatus) => {
    let playerCount;
    try {
        playerCount = await getPlayers(); // TODO: Get player count from RCON
    } catch (err) {
        console.error(err);
        await sendMessage(client, String(err));
        return;
    }

    if (client.serverStatus === PENDING_SHUTDOWN) return;
    if (client.serverStatus === SERVER_TURNING_OFF) return;

    if (client.serverStatus !== SERVER_ONLINE) {
        const now = new Date();

        console.log('Server is online');
        await sendMessage(client, 'Server is now online.');
        await setPresence(client, `Online - ${playerCount}`, 'online');
        client.playerCount = playerCount;
        client.serverStatus = SERVER_ONLINE;

        const bootGracePeriod = moment(now).add({ seconds: botGraceIn });
        client.bootGracePeriod = bootGracePeriod.toDate();
    }

    if (playerCount === 0) {
        await handleZeroPlayers(client);
        return;
    }

    if (client.playerCount !== playerCount) {
        console.log('Updating player count');
        await setPresence(client, `Online - ${playerCount}`, 'online');
        client.serverStatus = SERVER_ONLINE;
    }
};

const getPlayers = async () => {
    try {
        const rconClient = new A3Rcon(serverAddress, rconPort, rconPassword);
        await rconClient.connect();
        const resp = await rconClient.getPlayerCount();
        await rconClient.close();
        return resp;
    } catch (err) {
        console.error(err);
        return 0;
    }
};

const handleZeroPlayers = async (client: ClientWithServerStatus) => {
    const now = new Date();

    if (client.bootGracePeriod && now < client.bootGracePeriod) {
        console.log(`Server is empty but in grace period. Grace period lasts until ${client.bootGracePeriod}`);
        return;
    }

    client.serverStatus = PENDING_SHUTDOWN;
    if (!client.turnOffTime) {
        console.log('Server is empty, starting shutdown timer');
        const shutdownDateTime = moment(now).add(shutdownIn, 'seconds');
        client.turnOffTime = shutdownDateTime.toDate();

        await sendMessage(client, `Server is empty, shutting down in ${shutdownIn} seconds.`);
        await setPresence(client, `Shutting down at ???`, 'idle');

        return;
    }

    if (now > client.turnOffTime) {
        console.log('Server shutting down');
        try {
            await turnServerOff(client);
            await sendMessage(client, 'Server is now shutting down');
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
