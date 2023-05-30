import { checkServerInterval } from '../envVars';
import { logger } from '../logger';
import { checkServer } from '../timedCommands/checkServer';
import { ClientWithServerStatus } from '../types';

const setTimedEvents = (client: ClientWithServerStatus) => {
    setInterval(async () => {
        const now = new Date();
        await checkServer(client);
        logger.info('Stats', {
            now,
            clientPlayerCount: client.playerCount,
            clientServerStatus: client.serverStatus,
            clientTurnOffTime: client.turnOffTime,
            clientBootGracePeriod: client.bootGracePeriod,
        });
    }, checkServerInterval * 1000); // Env var in seconds, turn into milliseconds
};

export default setTimedEvents;
