import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import { ClientExtended, Command } from '../types/discordTypes';
import { getServersForGuild } from '../db/servers';
import logger, { getCommandLogInfo } from '../logging';

export const getServers: Command = {
    name: 'servers',
    description: 'Get the list of servers for this guild',
    type: ApplicationCommandType.ChatInput,
    run: async (client: ClientExtended, interaction: CommandInteraction) => {
        const guildId = interaction.guildId;
        if (!guildId) return;

        logger.info(getCommandLogInfo(interaction), 'getServers: Getting servers');

        const servers = getServersForGuild(guildId);

        logger.debug({ ...getCommandLogInfo(interaction), servers }, 'getServers: Got servers');

        let message = 'Servers: \n**Name | Game | IP | Player Count | Status**\n';

        for (const server of servers) {
            // TODO: Better format
            message += [
                server.name,
                server.game,
                `${client.publicAddress}:${server.port}`,
                await server.getPlayerCount(),
                await server.getStatus(),
            ].join(' | ');
            message += '\n';
        }

        await interaction.followUp({
            content: message,
        });
    },
};
