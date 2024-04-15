import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import apiRouter from './routes/api/index';
import {errors} from 'celebrate';
import {errorHandler} from './middlewares/errorHandler';
import {corsResolver} from './middlewares/corsChecker';

const PORT = 3000;

// process.chdir(__dirname);


const app = express();
app.use(
   helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
   })
);
app.use(corsResolver);

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/api', apiRouter);

// app.use((req, res, next) => {
//    return next(new NotFoundError('Запрашиваемый путь не существует.'));
// });

// app.use(logger); // подключаем логгер запросов
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`> App listening on port ${PORT}`);
   // console.log(apiRouter.stack)
});
