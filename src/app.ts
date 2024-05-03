import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import apiRouter from './routes/api/index';
import { errors } from 'celebrate';
import { errorHandler } from './middlewares/errorHandler';

import mongoose from 'mongoose';
import db from './config/db';
import { pipelineProvider } from './utils/PipelineProvider/PipelineProvider';

const PORT = 3000;

const pProvider = pipelineProvider;
const app = express();
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.use(errors());
app.use(errorHandler);
mongoose
    .connect(db.url)
    .then(() => {
        console.log('Database connected!');
        pProvider.scanDB();
    })
    .catch((err) => {
        console.log(`Database connection error: ${err.name} (${err.message})`);
    });

app.listen(PORT, () => {
    console.log(`> App listening on port ${PORT}`);
});
