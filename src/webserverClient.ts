import axios, { AxiosRequestConfig } from 'axios';
import { GuildServer } from './db/servers';
import { serverWebAddress } from './env';

const secretToken = process.env['WEB_SERVER_SECRET_TOKEN'] || 'devSecret';
const BASE_URL = serverWebAddress;

/**
 * Client for the webserver running on the remote server.
 */
class WebserverClient {
    /**
     * Make a request to the webserver.
     * @param config - The axios request config, with the url, method, etc set.
     * @returns The response data from the webserver.
     */
    private makeRequest = async (config: AxiosRequestConfig) => {
        const response = await axios.request({
            ...config,
            headers: {
                ...config.headers,
                'Content-Type': 'application/json',
                Authorization: secretToken,
            },
        });

        return response.data;
    };

    /**
     * Ping the webserver.
     * @returns The response from the webserver.
     */
    public ping = async () => {
        return this.makeRequest({
            method: 'GET',
            url: `${BASE_URL}/ping`,
        });
    };

    /**
     * Create a server on the webserver.
     * @param guildServer - The server to create on the remote server.
     * @returns TODO
     */
    public createServer = async (guildServer: GuildServer) => {
        const { guildId, serverId, name, game, port } = guildServer;
        const serverVals = { guildId, serverId, name, game, port };

        // TODO: Sure up response and decode, etc
        return await this.makeRequest({
            method: 'POST',
            url: `${BASE_URL}/server`,
            data: serverVals,
        });
    };
}

const client = new WebserverClient();

export default client;
