import { Client, CommandInteraction, Interaction } from 'discord.js';
import commands from '../commands';

/**
 * Handle any incoming slash commands made by users in the server.
 * Automatically defers the reply and runs the command.
 *
 * @param client - The Discord client.
 * @param interaction - The command interaction to be ran
 */
const handleSlashCommand = async (client: Client, interaction: CommandInteraction) => {
    const slashCommand = commands.find((command) => command.name === interaction.commandName);

    if (!slashCommand) {
        await interaction.followUp({
            content: 'An error occurred',
        });
        return;
    }

    await interaction.deferReply({
        ephemeral: slashCommand.ephermal || false,
    });

    await slashCommand.run(client, interaction);
};

/**
 * Handle any incoming interactions made by users in the server.
 *
 * @param client - The Discord client.
 */
export default (client: Client) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};
