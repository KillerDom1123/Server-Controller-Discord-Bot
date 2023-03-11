import { ApplicationCommandType, Client, CommandInteraction } from 'discord.js';
import { Command } from '../types';

export const pingCommand: Command = {
    name: 'ping',
    description: 'Check that the bot is alive and working',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        console.log('Neam');

        await interaction.followUp({
            content: 'Pong',
        });
    },
};
