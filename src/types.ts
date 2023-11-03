import { ChatInputApplicationCommandData, Client, CommandInteraction } from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => Promise<void>;
    ephermal?: boolean;
}

export interface ClientExtended extends Client {
    publicAddress?: string;
}
