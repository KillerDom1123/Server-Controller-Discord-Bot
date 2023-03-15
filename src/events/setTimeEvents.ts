import { checkServerInterval } from '../envVars';
import { checkServer } from '../timedCommands/checkServer';
import { ClientWithServerStatus } from '../types';

const setTimedEvents = (client: ClientWithServerStatus) => {
    setInterval(async () => {
        await checkServer(client);
        console.log('Stats', {
            clientPlayerCount: client.playerCount,
            clientServerStatus: client.serverStatus,
            clientTurnOffTime: client.turnOffTime,
            clientBootGracePeriod: client.bootGracePeriod,
        });
    }, checkServerInterval * 1000); // Env var in seconds, turn into milliseconds
};

export default setTimedEvents;
