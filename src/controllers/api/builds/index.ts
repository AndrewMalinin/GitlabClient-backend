import {RequestHandler} from 'express';

const getBuilds: RequestHandler = (req, res, next) => {
   res.send('TEST')
   next();
};

export default {
   getBuilds,
};
