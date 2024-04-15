import {HTTPError} from '../errors/index';

export function errorHandler(err: HTTPError, req: any, res: any, next: any) {
   const {statusCode = 500, message = 'Неизвестная ошибка.'} = err;
   res.status(statusCode).send({statusCode, message});
   next();
}
