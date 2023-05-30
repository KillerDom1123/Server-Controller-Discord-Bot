import { checkServerInterval } from '../envVars';
import { logger } from '../logger';
import { checkServer } from '../timedCommands/checkServer';
import { ClientWithServerStatus } from '../types';

const setTimedEvents = (client: ClientWithServerStatus) => {
    setInterval(async () => {
        const now = new Date();
        await checkServer(client);

        const stats = {
            now,
            clientPlayerCount: client.playerCount,
            clientServerStatus: client.serverStatus,
            clientTurnOffTime: client.turnOffTime,
            clientBootGracePeriod: client.bootGracePeriod,
        };

        logger.info(`Stats ${JSON.stringify(stats)}`);
    }, checkServerInterval * 1000); // Env var in seconds, turn into milliseconds
};

export default setTimedEvents;
