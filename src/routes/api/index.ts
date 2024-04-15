import express from 'express';
import buildsRouter from './builds/index';

const apiRouter = express.Router();

apiRouter.use('/builds', buildsRouter);

export default apiRouter;
