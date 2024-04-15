import express from 'express';
import buildsController from '../../../controllers/api/builds';

const buildsRouter = express.Router();

buildsRouter.get('/', buildsController.getBuilds);

export default buildsRouter;
