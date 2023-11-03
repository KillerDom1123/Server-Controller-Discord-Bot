import pino from 'pino';
import { loggingLevel } from './env';
import { CommandInteraction } from 'discord.js';

const logger = pino({
    name: 'SCDB',
    level: loggingLevel,
});

export const getCommandLogInfo = (interaction: CommandInteraction) => ({
    guildId: interaction.guildId,
    userId: interaction.user.id,
    commandName: interaction.commandName,
});

export default logger;
