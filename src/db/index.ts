import JSONdb from 'simple-json-db';
import { DB_FILE } from '../env';

const db = new JSONdb(DB_FILE);

export default db;
