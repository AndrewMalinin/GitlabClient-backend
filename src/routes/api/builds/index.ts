import express from 'express';
import buildsController from '../../../controllers/api/builds';
import { addBuildValidationSchema } from './validation/validationSchemas';

const buildsRouter = express.Router();

buildsRouter.get('/', buildsController.getAllBuilds);
buildsRouter.post('/', addBuildValidationSchema, buildsController.addBuild);

export default buildsRouter;
