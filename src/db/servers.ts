import db, { decodeObject } from '.';
import { GuildServerListType, GuildServerType } from '../iots';

export class GuildServer {
    guildId: string;
    serverId: string;
    name: string;
    game: string;
    port: number;
    lastActive: Date;

    constructor(guildId: string, serverId: string, name: string, game: string, port: number, lastActive: Date) {
        this.guildId = guildId;
        this.serverId = serverId;
        this.name = name;
        this.game = game;
        this.port = port;
        this.lastActive = lastActive;
    }

    static fromDb = (dbServer: GuildServerType) => {
        const { guildId, serverId, name, game, port, lastActive } = dbServer;
        return new GuildServer(guildId, serverId, name, game, port, new Date(lastActive));
    };

    saveToDb = () => {
        const vals = {
            guildId: this.guildId,
            serverId: this.serverId,
            name: this.name,
            game: this.game,
            port: this.port,
            lastActive: this.lastActive.toISOString(),
        };

        db.set(serverKey(this.guildId, this.serverId), vals);
    };

    create = () => {
        let serverList = getDbServerList(this.guildId);
        if (!serverList)
            serverList = {
                guildId: this.guildId,
                serverIds: [],
            };

        serverList.serverIds.push(this.serverId);
        this.saveToDb();
        db.set(serversKey(this.guildId), serverList);
    };

    getPlayerCount = async () => {
        const playerCount = 1;
        if (playerCount < 0) this.lastActive = new Date();

        return playerCount;
    };

    getStatus = async () => {
        return 'idk';
    };
}

const serversKey = (guildId: string) => `${guildId}/servers`;
const serverKey = (guildId: string, serverId: string) => `${guildId}/servers/${serverId}`;

const getDbServerList = (guildId: string) => {
    const dbServersList = db.get(serversKey(guildId));
    if (!dbServersList) return;

    const decodedServersList = decodeObject(dbServersList, GuildServerListType) as GuildServerListType;
    return decodedServersList;
};

export const getDbServersForGuild = (guildId: string) => {
    const dbServersList = getDbServerList(guildId);
    if (!dbServersList) return [];

    const decodedServersList = decodeObject(dbServersList, GuildServerListType) as GuildServerListType;

    const servers = decodedServersList.serverIds.map((serverId) => {
        const dbServer = db.get(serverKey(guildId, serverId)) || {};
        console.log(typeof dbServer.lastActive, dbServer, dbServer.lastActive);
        const decodedServer = decodeObject(dbServer, GuildServerType) as GuildServerType;
        return decodedServer;
    });

    return servers;
};

export const getServersForGuild = (guildId: string) => {
    const dbServers = getDbServersForGuild(guildId);
    const servers: GuildServer[] = dbServers.map((dbServer) => GuildServer.fromDb(dbServer));

    return servers;
};

export const getServerForGuildWithId = (guildId: string, serverId: string) => {
    const key = serverKey(guildId, serverId);
    const dbServer = db.get(key) || {};
    const decodedServer = decodeObject(dbServer, GuildServerType) as GuildServerType;

    return GuildServer.fromDb(decodedServer!);
};
