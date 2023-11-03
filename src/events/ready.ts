import { Client } from 'discord.js';
import commands from '../commands';

export default (client: Client) => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(commands);
        await client.user.setPresence({
            // activities: [
            //     {
            //         name: '',
            //     },
            // ],
            status: 'online',
        });

        // setTimedEvents(client);

        console.log('Bot online');
    });
};
