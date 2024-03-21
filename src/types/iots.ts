import * as t from 'io-ts';

const DateFromString = new t.Type<Date, string, unknown>(
    'DateFromString',
    (input): input is Date => input instanceof Date,
    (input, context) => {
        if (typeof input === 'string') {
            const date = new Date(input);
            return isNaN(date.getTime()) ? t.failure(input, context) : t.success(date);
        }
        return t.failure(input, context);
    },
    (date) => date.toISOString(),
);

export const GuildServerType = t.type({
    guildId: t.string,
    serverId: t.string,
    name: t.string,
    game: t.string,
    port: t.number,
    lastActive: DateFromString,
});

export type GuildServerType = t.TypeOf<typeof GuildServerType>;

export const GuildServerListType = t.type({
    guildId: t.string,
    serverIds: t.array(t.string),
});

export type GuildServerListType = t.TypeOf<typeof GuildServerListType>;
