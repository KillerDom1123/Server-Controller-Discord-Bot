# Server-Controller-Discord-Bot

This bot is designed to control the power usage and noise of a physical server by turning it on and off based on whether anyone is currently using the Arma server it runs. The bot can be accessed through Discord and utilizes the ILO 4 REST API to turn the server on and off, and SSH to run scripts on the server.

## Prerequisites

In order to use this bot, you will need the following:

-   A Discord server
-   A physical server that uses ILO, running an Arma server with RCON enabled

## Installation

1. Clone this repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Create a .env file with the below environment variables filled out.
4. Start the bot using `npm start`.

## Environment Variables

-   DISCORD_TOKEN: The Discord bot's secret token
-   GUILD_ID: The Discord server's ID
-   CHANNEL_ID: The Discord channel's ID
-   SERVER_ADDRESS: The IP address of the server, this will be used to SSH onto and RCON
-   ILO_ADDRESS: The IP address for ILO
-   ILO_USERNAME: The ILO username
-   ILO_PASSWORD: The ILO password
-   SHUTDOWN_TIME: The number of seconds the server needs to be empty for until it turns off
-   SSH_USERNAME: The SSH username for the server
-   SSH_PASSWORD: The SSH password for the server
-   RCON_PORT: The RCON port for the Arma server
-   RCON_PASSWORD: The RCON password for the Arma server
-   BOOT_GRACE_PERIOD: The amount of time in seconds after the server has turned on for the first time until it can be turned off for being empty
-   CHECK_SERVER_INTERVAL: The interval in seconds that the bot will check the server

## Usage

Once the bot is running, you can control your server by using the following commands in Discord:

/wake: Sends a POST request to the ILO 4 REST API to turn on the server.

## Forewarnings

This code isn't perfect. There isn't very much error handling arma3-rcon doesn't have any type type declarations.

If you do anything with Axios other than interacting with ILO, you'll need to remove `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` in
src/iloClient.ts

## Acknowledgements

This bot was inspired by the need to reduce power usage and noise from a physical server running an Arma server, and utilizes the ILO 4 REST API and SSH to achieve this goal. Special thanks to the following libraries:

Discord.js: https://discord.js.org
Axios: https://github.com/axios/axios
arma3-rcon: https://github.com/dotFionn/arma3-rcon
