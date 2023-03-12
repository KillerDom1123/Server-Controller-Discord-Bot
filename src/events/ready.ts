import commands from '../commands';
import { SERVER_PENDING } from '../constants';
import { ClientWithServerStatus } from '../types';
import setTimedEvents from './setTimeEvents';

export default (client: ClientWithServerStatus) => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }
        client.serverStatus = SERVER_PENDING;

        await client.application.commands.set(commands);
        await client.user.setPresence({
            activities: [
                {
                    name: 'Starting up...',
                },
            ],
            status: 'online',
        });

        setTimedEvents(client);

        console.log('Bot online');
    });
};
