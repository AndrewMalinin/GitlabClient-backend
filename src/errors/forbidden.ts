import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';
import {HTTPError} from './index';

export class ForbiddenError extends HTTPError {
   constructor(message = 'У вас нет прав на выполнение этого действия.') {
      super(message, HTTP_STATUS_CODE.FORBIDDEN);
   }
}
