import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';
import {HTTPError} from './index';

export class BadRequestError extends HTTPError {
   constructor(message = 'В запросе допущена ошибка.') {
      super(message, HTTP_STATUS_CODE.BAD_REQUEST);
   }
}
