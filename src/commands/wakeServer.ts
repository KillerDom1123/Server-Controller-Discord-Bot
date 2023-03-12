import { ApplicationCommandType, Client, CommandInteraction } from 'discord.js';
import { Command } from '../types';
import axios from 'axios';
import IloClient from '../iloClient';

const iloUsername = process.env.ILO_USERNAME || '';
const iloPassword = process.env.ILO_PASSWORD || '';

export const wakeServerCommand: Command = {
    name: 'wake',
    description: 'Wake the server if it is offline',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        console.log('Waking server...');

        try {
            const iloClient = new IloClient();
            await iloClient.signIn(iloUsername, iloPassword);
            await iloClient.powerOn(1);
            await iloClient.logout();
        } catch (err) {
            if (err instanceof axios.AxiosError) {
                console.log(err.message);
                await interaction.followUp({
                    content: err.message,
                });
                return;
            }
        }

        await interaction.followUp({
            content: 'Turning the server on...',
        });
    },
};
