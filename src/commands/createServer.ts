import { ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction } from 'discord.js';
import { ClientExtended, Command } from '../types';
import { GuildServer } from '../db/servers';
import { randomUUID } from 'crypto';
import { getPort } from '../utils';
import logger, { getCommandLogInfo } from '../logging';

export const createServer: Command = {
    name: 'createserver',
    description: 'Create a server for this guild',
    type: ApplicationCommandType.ChatInput,
    ephermal: true,
    options: [
        {
            name: 'servername',
            description: 'The name of the server',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'game',
            description: 'The game serer to create',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Minecraft',
                    value: 'minecraft',
                },
                {
                    name: 'Arma 3',
                    value: 'arma3',
                },
            ],
        },
    ],
    run: async (_client: ClientExtended, interaction: CommandInteraction) => {
        const guildId = interaction.guildId;
        if (!guildId) return;

        logger.info(getCommandLogInfo(interaction), 'createServer: Starting to create server');

        const serverName = String(interaction.options.get('servername')?.value);
        const game = String(interaction.options.get('game')?.value);

        const serverId = randomUUID();
        const port = await getPort();

        const lastActive = new Date();

        logger.debug(
            { ...getCommandLogInfo(interaction), serverName, game, serverId, port },
            'createServer: Got following information',
        );

        const server = new GuildServer(guildId, serverId, serverName, game, port, lastActive);
        server.create();
        // server.create;

        logger.info({ ...getCommandLogInfo(interaction), serverId }, 'createServer: Created new server');

        await interaction.followUp({
            content: 'yeet',
        });
    },
};
