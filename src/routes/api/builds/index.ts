import express from 'express';
import buildsController from '../../../controllers/api/builds';
import { addBuildValidationSchema, deleteBuildValidationSchema } from './validation/validationSchemas';

const buildsRouter = express.Router();

buildsRouter.get('/', buildsController.getAllBuilds);
buildsRouter.post('/', addBuildValidationSchema, buildsController.addBuild);
buildsRouter.delete('/:id', deleteBuildValidationSchema, buildsController.deleteBuild);

export default buildsRouter;
