import ping from 'ping';
import { ClientWithServerStatus } from '../types';
import { SERVER_OFFLINE, SERVER_ONLINE, SERVER_TURNING_OFF } from '../constants';
import { PresenceStatusData, TextChannel } from 'discord.js';
import moment from 'moment';
import SSH from 'simple-ssh';

const sshUsername = process.env.SSH_USERNAME || '';
const sshPassword = process.env.SSH_PASSWORD || '';
const serverAddress = process.env.SERVER_ADDRESS || '';
const controlGuild = process.env.GUILD_ID || '';
const controlChannel = process.env.CHANNEL_ID || '';
const shutdownIn = (process.env.SHUTDOWN_TIME as unknown as number) || 0; // In seconds

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
    const playerCount = 0; // TODO: Get player count from RCON

    if (playerCount === 0) {
        await handleZeroPlayers(client);
        return;
    }

    if (client.serverStatus === SERVER_TURNING_OFF) return;

    if (client.serverStatus !== SERVER_ONLINE) {
        console.log('Server is online');
        await sendMessage(client, 'Server is now online.');
        await setPresence(client, `Online - ${playerCount}`, 'online');
        client.playerCount = playerCount;
        client.serverStatus = SERVER_ONLINE;
    }

    if (client.playerCount !== playerCount) {
        console.log('Updating player count');
        await setPresence(client, `Online - ${playerCount}`, 'online');
        client.serverStatus = SERVER_ONLINE;
    }
};

const handleZeroPlayers = async (client: ClientWithServerStatus) => {
    const now = new Date();

    client.serverStatus = SERVER_TURNING_OFF;
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
        } catch (err) {
            console.error(err);
            await sendMessage(client, String(err));
        }
        return;
    }
};

const turnServerOff = async (client: ClientWithServerStatus) => {
    client.serverStatus = SERVER_TURNING_OFF;
    client.turnOffTime = undefined;
    try {
        const ssh = new SSH({
            host: '192.168.0.122',
            user: sshUsername,
            pass: sshPassword,
        });
        ssh.exec('bash shutdown.sh -S', {
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
