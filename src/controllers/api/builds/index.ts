import { RequestHandler } from 'express';
import Build from '../../../models/Build';
import { InternalServerError } from '../../../errors/internalServer';
import { IBuildsRequestData } from '../../../routes/api/builds/types';
import User, { getUserOrCreate } from '../../../models/User';
import { PIPELINE_STATUS } from '../../../models/Build/pipelineSchema';
import { BadRequestError } from '../../../errors/badRequest';
import { ConflictError } from '../../../errors/conflict';
import { NotFoundError } from '../../../errors/notFound';
import { HTTP_STATUS_CODE } from '../../../types';

const getAllBuilds: RequestHandler = (req, res, next) => {
    Build.find({})
        .lean()
        .then((builds) => res.send(builds))
        .catch((err) => {
            console.log(err);
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
        .then((builds) => res.send(builds))
        .catch((err) => {
            console.log(err)
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

// module.exports.getAllMovies = (req, res, next) => {
//    Movie.find({})
//       .then(movies => res.send(movies))
//       .catch(() => next(new InternalServerError()));
// };

// module.exports.createMovie = (req, res, next) => {
//    const owner = req.user._id;
//    Movie.create({...req.body, owner})
//       .then(movie => res.send(movie))
//       .catch(err => {
//          if (err.name === 'ValidationError') {
//             next(new BadRequestError('Data is not valid.'));
//          } else {
//             next(new InternalServerError());
//          }
//       });
// };

// module.exports.deleteMovie = (req, res, next) => {
//    const {movieId} = req.params;
//    const owner = req.user._id;
//    Movie.findOne({movieId, owner})
//       .then(movie => {
//          if (movie === null) {
//             next(new NotFoundError('Movie not found.'));
//          } else if (movie.owner.valueOf() === req.user._id) {
//             Movie.findByIdAndRemove(movie._id)
//                .then(() => {
//                   res.send(movie);
//                })
//                .catch(() => {
//                   next(new InternalServerError());
//                });
//          } else {
//             next(new ForbiddenError("You don't have permissions to delete other movies."));
//          }
//       })
//       .catch(err => {
//          if (err.name === 'CastError') {
//             next(new BadRequestError('Id is not a valid.'));
//          } else {
//             next(new InternalServerError());
//          }
//       });
// };

export default {
    getAllBuilds,
    addBuild,
    deleteBuild
};
