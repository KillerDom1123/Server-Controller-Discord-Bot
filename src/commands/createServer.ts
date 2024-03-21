import { ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction } from 'discord.js';
import { ClientExtended, Command } from '../types/types';
import { GuildServer } from '../db/servers';
import { randomUUID } from 'crypto';
import { getPort } from '../utils';
import logger, { getCommandLogInfo } from '../logging';
import webserverClient from '../webserverClient';
import { isAxiosError } from 'axios';

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

        try {
            console.log('Do a thing');
            const resp = await webserverClient.createServer(server);
            console.log(resp);
        } catch (err: unknown) {
            console.error('AAAAAAAAAA');
            if (isAxiosError(err)) {
                console.log(err);
                return;
            }
            console.log(err);
        }

        // server.create();
        // server.create;

        // logger.info({ ...getCommandLogInfo(interaction), serverId }, 'createServer: Created new server');

        // const serverDirectory = await createDirectory(guildId, serverId);
        // console.log(serverDirectory);

        await interaction.followUp({
            content: 'yeet',
        });
    },
};

// const createDirectory = async (guildId: string, serverId: string) => {
//     const guildDirExists =
//         (await sshConnection.execCommand(`if test -d ~/servers/${guildId}; then echo "true";`)).stdout === 'true';

//     if (!guildDirExists) {
//         await sshConnection.execCommand(`mkdir ~/servers/${guildId}`);
//     }

//     await sshConnection.execCommand(`mkdir ~/servers/${guildId}/${serverId}`);

//     return `~/servers/${guildId}/${serverId}`;
// };
