import axios, { AxiosRequestConfig } from 'axios';
import { GuildServer } from './db/servers';
import { serverWebAddress } from './env';
import * as t from 'io-ts';
import { decodeObject } from './utils/db';
import { CreateServerResponse } from './types';

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
    private makeRequest = async <T>(config: AxiosRequestConfig, decodeType: t.Type<T>) => {
        const response = await axios.request({
            ...config,
            headers: {
                ...config.headers,
                'Content-Type': 'application/json',
                Authorization: secretToken,
            },
        });

        const decodedData = decodeObject(response.data, decodeType);
        return decodedData;
    };

    /**
     * Create a server on the webserver.
     * @param guildServer - The server to create on the remote server.
     * @returns TODO
     */
    public createServer = async (guildServer: GuildServer) => {
        const { guildId, name, game, port } = guildServer;
        const serverVals = { guildId, name, game, port };

        // TODO: Sure up response and decode, etc
        return await this.makeRequest(
            {
                method: 'POST',
                url: `${BASE_URL}/server`,
                data: serverVals,
            },
            CreateServerResponse,
        );
    };
}

const client = new WebserverClient();

export default client;
