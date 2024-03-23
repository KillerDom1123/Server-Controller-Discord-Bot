import * as t from 'io-ts';

export const CreateServerResponse = t.type({
    username: t.string,
    password: t.string,
});

export type CreateServerResponse = t.TypeOf<typeof CreateServerResponse>;
