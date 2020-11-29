import express, { Application } from 'express';
import router from './routes/router';

const app: Application = express();

app.use(router);

export default app;
