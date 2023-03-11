import { CommandInteraction, Interaction } from 'discord.js';
import commands from '../commands';
import { ClientWithServerStatus } from '../types';

const handleSlashCommand = async (client: ClientWithServerStatus, interaction: CommandInteraction) => {
    const slashCommand = commands.find((command) => command.name === interaction.commandName);
    if (!slashCommand) {
        await interaction.followUp({
            content: 'An error occurred',
        });
        return;
    }

    await interaction.deferReply();
    slashCommand.run(client, interaction);
};

export default (client: ClientWithServerStatus) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};
