import { checkServer } from '../timedCommands/checkServer';
import { ClientWithServerStatus } from '../types';

const setTimedEvents = (client: ClientWithServerStatus) => {
    setInterval(async () => {
        await checkServer(client);
    }, 10000); // In milliseconds - Maybe make env variable?
};

export default setTimedEvents;
