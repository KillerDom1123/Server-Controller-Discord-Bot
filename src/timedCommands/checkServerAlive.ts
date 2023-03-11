import ping from 'ping';
import { ClientWithServerStatus } from '../types';
import { SERVER_OFFLINE, SERVER_ONLINE } from '../constants';

const serverAddress = process.env.SERVER_ADDRESS || '';
const controlGuild = process.env.GUILD_ID || '';
const controlChannel = process.env.CHANNEL_ID || '';

export const checkServerAlive = async (client: ClientWithServerStatus) => {
    const pingResp = await ping.promise.probe(serverAddress);
    if (pingResp.alive) client.serverStatus = SERVER_ONLINE;
    else client.serverStatus = SERVER_OFFLINE;
    // client.serverOnline = pingResp.alive;

    const guild = await client.guilds.fetch(controlGuild);
    const channel = await guild.channels.fetch(controlChannel);

    if (channel?.isTextBased()) {
        // await (channel as TextChannel).send('Test Log!');
    }
};

const setPresence = () => {};
