import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';
import {HTTPError} from './index';

export class ConflictError extends HTTPError {
   constructor(message = 'Ошибка изменения ресурса вследствие конфликта.') {
      super(message, HTTP_STATUS_CODE.CONFLICT);
   }
}
