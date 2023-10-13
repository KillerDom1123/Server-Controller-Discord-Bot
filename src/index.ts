import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { discordToken } from './env';

export const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
});

if (require.main === module) {
    console.log(discordToken);
    client.login(discordToken).catch((error) => console.error(error));
}
