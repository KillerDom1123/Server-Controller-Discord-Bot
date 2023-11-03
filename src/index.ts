import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { discordToken } from './env';
import ready from './events/ready';
import interactionCreate from './events/interactionCreate';
import { ClientExtended } from './types';
import { getExternalIp } from './utils';

export const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
}) as ClientExtended;

const doStart = async () => {
    // TODO: Add ability to manually set external IP
    client.publicAddress = await getExternalIp();
    ready(client);
    interactionCreate(client);
    await client.login(discordToken);
};

if (require.main === module) {
    doStart().catch((err) => console.error(err));
}
