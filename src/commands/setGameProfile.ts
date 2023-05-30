import { ApplicationCommandType, CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import { ClientWithServerStatus, Command } from '../types';
import { lastProfileFileName, validProfiles } from '../utils';
import fs from 'fs';
import { logger } from '../logger';

export const setGameProfileCommand: Command = {
    name: 'profile',
    description: 'Set the game profile for the bot to use',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'game',
            description: 'Specific profile for the bot to use',
            type: ApplicationCommandOptionType.String, // Specify the argument type (in this case, a string)
            required: true, // Set to false if the argument is optional
            choices: validProfiles.map((profile) => {
                return {
                    name: profile,
                    value: profile,
                };
            }),
        },
    ],

    run: async (client: ClientWithServerStatus, interaction: CommandInteraction) => {
        const selectedProfile = interaction.options.get('game')?.value as string;
        logger.info(`Changed to profile ${selectedProfile}`);
        if (!validProfiles.includes(selectedProfile)) {
            await interaction.followUp({
                content: `Invalid profile`,
            });
        }

        client.profile = selectedProfile;
        await interaction.followUp({
            content: `Profile changed to ${selectedProfile}`,
        });

        fs.writeFileSync(lastProfileFileName, selectedProfile);
    },
};
