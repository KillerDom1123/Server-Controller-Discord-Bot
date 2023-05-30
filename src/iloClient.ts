import axios, { isAxiosError } from 'axios';
import { logger } from './logger';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // VERY BAD - REMOVE IF USING AXIOS ELSEWHERE!!!

const baseIloUrl = `https://${process.env.ILO_ADDRESS}/redfish/v1`;

const axiosConfig = {
    headers: {
        ['Content-Type']: 'application/json',
        ['X-Auth-Token']: null,
    },
};

const axiosClient = axios.create(axiosConfig);

class IloClient {
    sessionToken?: string;
    sessionLocation?: string;
    isLoggedIn: boolean;

    constructor() {
        this.isLoggedIn = false;
    }

    public async signIn(username: string, password: string) {
        logger.info('Logging in');
        try {
            const resp = await axiosClient.post(`${baseIloUrl}/SessionService/Sessions/`, {
                UserName: username,
                Password: password,
            });

            const sessionToken = resp.headers['x-auth-token'];
            const sessionLocation = resp.headers['location'];

            this.sessionToken = sessionToken;
            this.sessionLocation = sessionLocation;

            axiosConfig.headers['X-Auth-Token'] = sessionToken;

            this.isLoggedIn = true;
        } catch (err) {
            if (isAxiosError(err)) {
                logger.error(err.message);
            } else {
                logger.error(err);
            }
            throw err;
        }
    }

    public async logout() {
        logger.info('Logging out');
        if (!this.isLoggedIn || !this.sessionLocation) throw new Error('Client not logged in!');

        try {
            await axiosClient.delete(this.sessionLocation, axiosConfig);
        } catch (err) {
            if (isAxiosError(err)) {
                logger.error(err.message, err.response?.data);
            } else {
                logger.error(err);
            }
            throw err;
        }
    }

    public async powerOn(systemId: number) {
        logger.info('Powering on');
        if (!this.isLoggedIn || !this.sessionLocation) throw new Error('Client not logged in!');

        try {
            await axiosClient.post(
                `${baseIloUrl}/systems/${systemId}/`,
                {
                    Action: 'Reset',
                    ResetType: 'On',
                },
                axiosConfig,
            );
        } catch (err) {
            if (isAxiosError(err)) {
                logger.error(err.message, err.response?.data);
            } else {
                logger.error(err);
            }
            throw err;
        }
    }

    public async powerOff(systemId: number) {
        logger.info('Powering off');
        if (!this.isLoggedIn || !this.sessionLocation) throw new Error('Client not logged in!');

        try {
            await axiosClient.post(
                `${baseIloUrl}/systems/${systemId}/`,
                {
                    Action: 'Reset',
                    ResetType: 'PushPowerButton',
                },
                axiosConfig,
            );
        } catch (err) {
            if (isAxiosError(err)) {
                logger.error(err.message, err.response?.data);
            } else {
                logger.error(err);
            }
            throw err;
        }
    }
}

export default IloClient;
