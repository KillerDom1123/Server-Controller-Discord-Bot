import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { discordToken } from './env';
import ready from './events/ready';
import interactionCreate from './events/interactionCreate';
import { ClientExtended } from './types/discordTypes';

export const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
}) as ClientExtended;

const doStart = async () => {
    ready(client);
    interactionCreate(client);
    await client.login(discordToken);
};

if (require.main === module) {
    doStart().catch((err) => console.error(err));
}
