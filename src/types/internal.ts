import * as t from 'io-ts';
import { DateFromString } from './utils';

export const GuildServerType = t.type({
    guildId: t.string,
    username: t.string,
    name: t.string,
    game: t.string,
    port: t.number,
    lastActive: t.union([DateFromString, t.string]),
});

export type GuildServerType = t.TypeOf<typeof GuildServerType>;

export const GuildServerListType = t.type({
    guildId: t.string,
    usernames: t.array(t.string),
});

export type GuildServerListType = t.TypeOf<typeof GuildServerListType>;
