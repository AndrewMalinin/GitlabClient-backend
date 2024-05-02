import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import apiRouter from './routes/api/index';
import { errors } from 'celebrate';
import { errorHandler } from './middlewares/errorHandler';

import dbConfig from './config/db';
import mongoose from 'mongoose';
import db from './config/db';
import wt from 'worker_threads';
import { pipelineProvider } from './utils/PipelineProvider/PipelineProvider';

const PORT = 3000;

// process.chdir(__dirname);
const p = pipelineProvider;
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

// app.use((req, res, next) => {
//    return next(new NotFoundError('Запрашиваемый путь не существует.'));
// });

// app.use(logger); // подключаем логгер запросов
app.use(errors());
app.use(errorHandler);

mongoose
    .connect(db.url)
    .then(() => {
        console.log('Database connected!');
    })
    .catch((err) => console.log(`Database connection error: ${err.name} (${err.message})`));

app.listen(PORT, () => {
    console.log(`> App listening on port ${PORT}`);
    // console.log(apiRouter.stack)
});
