import { ApplicationCommandType, Client, CommandInteraction } from 'discord.js';
import { Command } from '../types';
import { logger } from '../logger';

export const pingCommand: Command = {
    name: 'ping',
    description: 'Check that the bot is alive and working',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        logger.info('Neam');

        await interaction.followUp({
            content: 'Pong',
        });
    },
};
