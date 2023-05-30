import pino from 'pino';
import fs from 'fs';

const transport = pino.destination('log.json');
export const logger = pino(
    {
        level: 'info',
    },
    transport,
);
