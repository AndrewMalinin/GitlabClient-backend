import {RequestHandler} from 'express';
import Build from '../../../models/Build';
import {InternalServerError} from '../../../errors/internalServer';

const getAllBuilds: RequestHandler = (req, res, next) => {
   Build.find({})
      .then(builds => res.send(builds))
      .catch(err => {
         console.log(err);
         next(new InternalServerError());
      });
   // next();
};

const addBuild: RequestHandler = (req, res, next) => {
   const props = req.body;
   Build.create({
      //branch: props.
   })
      .then(builds => res.send(builds))
      .catch(err => {
         console.log(err)
         next(new InternalServerError())
      });
   next();
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
};
