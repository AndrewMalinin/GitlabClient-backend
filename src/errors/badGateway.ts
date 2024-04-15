import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';
import {HTTPError} from './index';

export class BadGatewayError extends HTTPError {
   constructor(message = 'Ошибка проксируемого сервера.') {
      super(message, HTTP_STATUS_CODE.BAD_GATEWAY);
   }
}
