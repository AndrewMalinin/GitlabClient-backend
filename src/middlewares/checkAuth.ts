import {RequestHandler} from 'express';

export const checkToken: RequestHandler = (req, res, next) => {
   next();
};
