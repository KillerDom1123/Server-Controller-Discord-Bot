import { Client, CommandInteraction, Interaction } from 'discord.js';
import commands from '../commands';

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

export default (client: Client) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};
