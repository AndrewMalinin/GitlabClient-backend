import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';
import {HTTPError} from './index';

export class UnauthorizedError extends HTTPError {
   constructor(message = 'Необходима авторизация.') {
      super(message, HTTP_STATUS_CODE.UNAUTHORIZED);
   }
}
