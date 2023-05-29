// @ts-ignore
import Arma3Rcon from 'arma3-rcon';
import * as mc from 'node-mcstatus';
import { rconPassword, rconPort, serverAddress, serverPort } from '../envVars';

export const armaGetPlayers = async () => {
    console.log('Execute armaGetPlayers');
    try {
        const rconClient = new Arma3Rcon(serverAddress, rconPort, rconPassword);
        await rconClient.connect();
        const resp = await rconClient.getPlayerCount();
        await rconClient.close();
        return parseInt(resp);
    } catch (err) {
        console.error(err);
        return 0;
    }
};

export const minecraftGetPlayers = async () => {
    console.log('Execute minecraftGetPlayers');
    try {
        const resp = await mc.statusJava(serverAddress, parseInt(serverPort.toString()));
        console.log(resp);
        const playerCount = resp?.players?.online || 0;
        return playerCount;
    } catch (err) {
        console.error(err);
        return 0;
    }
};
