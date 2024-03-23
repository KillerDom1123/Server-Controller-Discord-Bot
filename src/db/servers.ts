import db from '.';
import { GuildServerListType, GuildServerType } from '../types';
import { decodeObject } from '../utils/db';

export class GuildServer {
    guildId: string;
    name: string;
    game: string;
    port: number;
    lastActive: Date;
    username: string | undefined;

    constructor(guildId: string, name: string, game: string, port: number, lastActive: Date, username?: string) {
        this.guildId = guildId;
        this.name = name;
        this.game = game;
        this.port = port;
        this.lastActive = lastActive;
        this.username = username;
    }

    static fromDb = (dbServer: GuildServerType) => {
        const { guildId, username, name, game, port, lastActive } = dbServer;
        return new GuildServer(guildId, name, game, port, new Date(lastActive), username);
    };

    saveToDb = () => {
        const vals = {
            guildId: this.guildId,
            username: this.username,
            name: this.name,
            game: this.game,
            port: this.port,
            lastActive: this.lastActive.toISOString(),
        };

        if (!this.username) {
            throw new Error('Username not set');
        }

        db.set(serverKey(this.guildId, this.username), vals);
    };

    create = () => {
        let serverList = getDbServerList(this.guildId);
        if (!serverList)
            serverList = {
                guildId: this.guildId,
                usernames: [],
            };

        if (!this.username) {
            throw new Error('Username not set');
        }

        serverList.usernames.push(this.username);
        this.saveToDb();
        db.set(serversKey(this.guildId), serverList);
    };

    getPlayerCount = async () => {
        // TODO
        const playerCount = 1;
        return playerCount;
    };

    getStatus = async () => {
        // TODO
        return 'idk';
    };
}

const serversKey = (guildId: string) => `${guildId}/servers`;
const serverKey = (guildId: string, username: string) => `${guildId}/servers/${username}`;

const getDbServerList = (guildId: string) => {
    const dbServersList = db.get(serversKey(guildId));
    if (!dbServersList) return;

    const decodedServersList = decodeObject(dbServersList, GuildServerListType);
    return decodedServersList;
};

export const getDbServersForGuild = (guildId: string) => {
    const dbServersList = getDbServerList(guildId);
    if (!dbServersList) return [];

    const decodedServersList = decodeObject(dbServersList, GuildServerListType);

    const servers = decodedServersList.usernames.map((username) => {
        const dbServer = db.get(serverKey(guildId, username)) || {};
        const decodedServer = decodeObject(dbServer, GuildServerType);
        return decodedServer;
    });

    return servers;
};

export const getServersForGuild = (guildId: string) => {
    const dbServers = getDbServersForGuild(guildId);
    const servers: GuildServer[] = dbServers.map((dbServer) => GuildServer.fromDb(dbServer));

    return servers;
};

export const getServerForGuildWithId = (guildId: string, username: string) => {
    const key = serverKey(guildId, username);
    const dbServer = db.get(key) || {};
    const decodedServer = decodeObject(dbServer, GuildServerType);

    return GuildServer.fromDb(decodedServer!);
};
