import { ChatInputApplicationCommandData, Client, CommandInteraction } from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
}

export interface ClientWithServerStatus extends Client {
    serverStatus?: string;
    playerCount?: number;
    turnOffTime?: Date;
}
