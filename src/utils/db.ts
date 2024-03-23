import { isRight } from 'fp-ts/lib/Either';
import logger from '../logging';
import * as t from 'io-ts';
import reporter from 'io-ts-reporters';

/**
 * Decode an object using an io-ts type.
 * @param obj - The object to decode.
 * @param objType - The io-ts type to decode the object with.
 * @returns The decoded object.
 */
export const decodeObject = <T>(obj: unknown, objType: t.Type<T>) => {
    const result = objType.decode(obj);

    if (isRight(result)) {
        const decodedObj = result.right;
        return decodedObj;
    }
    logger.error('Invalid fields when decoding', { ...reporter.report(result), obj, objType });
    throw new Error('Invalid fields');
};
