import 'dotenv/config';

import { Client } from 'discord.js';
import ready from './events/ready';
import interactionCreate from './events/interactionCreate';
import { ClientWithServerStatus } from './types';
import { discordToken } from './envVars';
import { logger } from './logger';

logger.info('Bot is starting...');

export const client = new Client({
    intents: [],
}) as ClientWithServerStatus;

(async () => {
    ready(client);
    interactionCreate(client);
    await client.login(discordToken);
})().catch((err) => logger.error(err));
