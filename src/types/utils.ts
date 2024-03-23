import * as t from 'io-ts';

export const DateFromString = new t.Type<Date, string, unknown>(
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
