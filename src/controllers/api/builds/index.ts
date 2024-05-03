import { RequestHandler } from 'express';
import Build from '../../../models/Build';
import { InternalServerError } from '../../../errors/internalServer';
import { IBuildsRequestData } from '../../../routes/api/builds/types';
import { getUserOrCreate } from '../../../models/User';
import { PIPELINE_STATUS } from '../../../models/Build/pipelineSchema';
import { BadRequestError } from '../../../errors/badRequest';
import { ConflictError } from '../../../errors/conflict';
import { NotFoundError } from '../../../errors/notFound';
import { HTTP_STATUS_CODE } from '../../../types';
import { pipelineProvider } from '../../../utils/PipelineProvider/PipelineProvider';

const getAllBuilds: RequestHandler = (req, res, next) => {
    Build.find({})
        .lean()
        .then((builds) => res.send(builds))
        .catch((err) => {
            next(new InternalServerError());
        });
    // next();
};

const addBuild: RequestHandler = async (req, res, next) => {
    const props: IBuildsRequestData['CREATE_BUILD'] = req.body;
    const initiator = await getUserOrCreate(props.initiator);
    const isBuildExist = !!(await Build.exists({ id: props.pipeline.gitlab_id }));
    if (isBuildExist) return next(new ConflictError('Сборка с данными параметрами уже существует'));
    Build.create({
        ...props,
        id: props.pipeline.gitlab_id,
        pipeline: { ...props.pipeline, status: PIPELINE_STATUS.UNKNOWN },
        created_at: Date.now(),
        initiator
    })
        .then((build) => {
            pipelineProvider.addPipelineToQueue(build.project.gitlab_id, build.pipeline.gitlab_id);
            return res.send(build);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError());
            } else {
                next(new InternalServerError());
            }
        });
    //next();
};

const deleteBuild: RequestHandler = async (req, res, next) => {
    const buildId: number = +req.params['id'];
    const isBuildExist = !!(await Build.exists({ id: buildId }));
    if (!isBuildExist) return next(new NotFoundError('Сборка с данным Id не найдена'));
    Build.deleteOne({ id: buildId })
        .then(() => res.sendStatus(HTTP_STATUS_CODE.OK))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError());
            } else {
                next(new InternalServerError());
            }
        });
};

export default {
    getAllBuilds,
    addBuild,
    deleteBuild
};
