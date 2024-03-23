import { ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction } from 'discord.js';
import { ClientExtended, Command } from '../types/discordTypes';
import { GuildServer } from '../db/servers';
import { getPort } from '../utils';
import logger, { getCommandLogInfo } from '../logging';
import webserverClient from '../webserverClient';
import { isAxiosError } from 'axios';

/**
 * Slash command to create a server for the guild.
 *
 * Sends a POST request to the webserver to create a user on the server.
 * Returns the username and password so the user can access the server via FTP.
 */
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

        const port = await getPort();

        const lastActive = new Date();

        logger.debug(
            { ...getCommandLogInfo(interaction), serverName, game, port },
            'createServer: Got following information',
        );

        const server = new GuildServer(guildId, serverName, game, port, lastActive);

        try {
            const resp = await webserverClient.createServer(server);
            logger.info(
                { ...getCommandLogInfo(interaction), username: resp.username },
                'createServer: Created server successfully',
            );

            server.username = resp.username;

            await interaction.user.send(`Username: ${resp.username}\nPassword: ${resp.password}`);
            await interaction.followUp({
                content: `Server created successfully. <@${interaction.user.id}> check your DMs for the server FTP credentials.`,
            });

            server.create();
            return;
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err);
                return;
            }
        }

        await interaction.followUp({
            content: 'An error occurred while creating the server. Please try again later.',
        });
    },
};
