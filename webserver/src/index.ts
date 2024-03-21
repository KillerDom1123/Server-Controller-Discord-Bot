import express, { json } from 'express';
import loggingMiddleware from './middleware/loggingMiddleware';
import authMiddleware from './middleware/authMiddleware';
import routesIndex from './routes';
// import routesIndex from './routes';

const app = express();
const port = process.env['API_PORT'] || 3001;

app.use(json());
// app.options('*', cors<Request>());
app.use(loggingMiddleware);
app.use(authMiddleware);

app.use(routesIndex);

app.listen(port, () => {
    console.log(`SCDB web server listening on port ${port}`);
});
