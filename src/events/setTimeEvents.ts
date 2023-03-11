import { checkServerAlive } from '../timedCommands/checkServerAlive';
import { ClientWithServerStatus } from '../types';

const setTimedEvents = (client: ClientWithServerStatus) => {
    setInterval(async () => {
        await checkServerAlive(client);
    }, 10000);
};

export default setTimedEvents;
