import pino from 'pino';
import fs from 'fs';

const transport = pino.transport({
    targets: [
        {
            level: 'info',
            target: 'pino/file',
            options: {
                destination: `log.txt`,
            },
        },
        {
            level: 'trace',
            target: 'pino-pretty',
            options: {},
        },
    ],
});
export const logger = pino(
    {
        level: 'info',
    },
    transport,
);
