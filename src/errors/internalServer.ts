import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';
import {HTTPError} from './index';

export class InternalServerError extends HTTPError {
   constructor(message = 'На сервере возникло необработанное исключение.') {
      super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
   }
}
