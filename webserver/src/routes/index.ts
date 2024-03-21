import { Router } from 'express';
import { postServer } from './server';

const routesIndex = Router();

routesIndex.post('/server', postServer);

export default routesIndex;
