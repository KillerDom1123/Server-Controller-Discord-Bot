import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import { ClientWithServerStatus, Command } from '../types';
import axios from 'axios';
import IloClient from '../iloClient';
import { bootGraceIn, iloPassword, iloUsername } from '../envVars';
import moment from 'moment';

export const wakeServerCommand: Command = {
    name: 'wake',
    description: 'Wake the server if it is offline',
    type: ApplicationCommandType.ChatInput,
    run: async (client: ClientWithServerStatus, interaction: CommandInteraction) => {
        console.log('Waking server...');
        const now = new Date();

        try {
            const iloClient = new IloClient();
            await iloClient.signIn(iloUsername, iloPassword);
            await iloClient.powerOn(1);
            await iloClient.logout();

            const bootGracePeriod = moment(now).add({ seconds: bootGraceIn });
            client.bootGracePeriod = bootGracePeriod.toDate();
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
