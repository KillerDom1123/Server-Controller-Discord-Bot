import { isRight } from 'fp-ts/lib/Either';
import JSONdb from 'simple-json-db';
import logger from '../logging';
import * as t from 'io-ts';
import reporter from 'io-ts-reporters';

const dbFile = 'servers-db.json';

const db = new JSONdb(dbFile);

/**
 * Decode an object using an io-ts type.
 * @param obj - The object to decode.
 * @param objType - The io-ts type to decode the object with.
 * @returns The decoded object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodeObject = (obj: any, objType: any): any => {
    let result;
    if (obj instanceof Array) {
        result = t.array(objType).decode(obj);
    } else {
        result = objType.decode(obj);
    }

    if (isRight(result)) {
        const decodedObj = result.right;
        return decodedObj;
    }
    logger.error('Invalid fields when decoding', { ...reporter.report(result), obj, objType });
    throw Error('Decode field error');
};

export default db;
