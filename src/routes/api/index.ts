import express from 'express';
import buildsRouter from './builds/index';
import { corsResolver } from '../../middlewares/corsResolver';

const apiRouter = express.Router();

apiRouter.use('/builds', corsResolver, buildsRouter);

export default apiRouter;
