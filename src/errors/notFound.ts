import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';
import {HTTPError} from './index';

export class NotFoundError extends HTTPError {
   constructor(message = 'Запрашиваемый ресурс не найден.') {
      super(message, HTTP_STATUS_CODE.NOT_FOUND);
   }
}
