import commands from '../commands';
import { SERVER_PENDING } from '../constants';
import { logger } from '../logger';
import { ClientWithServerStatus } from '../types';
import { lastProfileFileName, validProfiles } from '../utils';
import setTimedEvents from './setTimeEvents';
import fs from 'fs';

const getLastProfile = () => {
    let lastProfile = validProfiles[0];

    const fileExists = fs.existsSync(lastProfileFileName);
    if (fileExists) {
        const readLastProfile = fs.readFileSync(lastProfileFileName).toString();
        if (validProfiles.includes(readLastProfile)) lastProfile = readLastProfile;
    }

    return lastProfile;
};

export default (client: ClientWithServerStatus) => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }
        client.profile = getLastProfile();
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

        logger.info('Bot online');
    });
};
