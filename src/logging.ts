import pino from 'pino';
import { loggingLevel } from './env';
import { CommandInteraction } from 'discord.js';

const logger = pino({
    name: 'SCDB',
    level: loggingLevel,
});

/**
 * Get some extra log info for a command interaction.
 * @param interaction - The interaction to get the log info for.
 * @returns The log info.
 */
export const getCommandLogInfo = (interaction: CommandInteraction) => ({
    guildId: interaction.guildId,
    userId: interaction.user.id,
    commandName: interaction.commandName,
});

export default logger;
