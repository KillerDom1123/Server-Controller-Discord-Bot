import { ApplicationCommandType, Client, CommandInteraction } from 'discord.js';
import { Command } from '../types';
import wol from 'wake_on_lan';

const serverMac = process.env.SERVER_MAC || '';
const serverAddress = process.env.SERVER_ADDRESS || '';

export const wakeServerCommand: Command = {
    name: 'wake',
    description: 'Wake the server if it is offline',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        console.log('Waking server...');

        console.log(serverMac);
        const resp = await wol.wake(serverMac);
        console.log(resp);

        await interaction.followUp({
            content: 'Turning the server on...',
        });
    },
};
