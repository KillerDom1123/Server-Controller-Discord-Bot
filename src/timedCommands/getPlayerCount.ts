// @ts-ignore
import Arma3Rcon from 'arma3-rcon';
import * as mc from 'node-mcstatus';
import { rconPassword, rconPort, serverAddress, serverPort } from '../envVars';
import { logger } from '../logger';

export const armaGetPlayers = async () => {
    logger.info('Execute armaGetPlayers');
    try {
        const rconClient = new Arma3Rcon(serverAddress, rconPort, rconPassword);
        await rconClient.connect();
        const resp = await rconClient.getPlayerCount();
        await rconClient.close();
        return parseInt(resp);
    } catch (err) {
        logger.error(err);
        return 0;
    }
};

export const minecraftGetPlayers = async () => {
    logger.info('Execute minecraftGetPlayers');
    try {
        const resp = await mc.statusJava(serverAddress, parseInt(serverPort.toString()));
        logger.info(resp);
        const playerCount = resp?.players?.online || 0;
        return playerCount;
    } catch (err) {
        logger.error(err);
        return 0;
    }
};
