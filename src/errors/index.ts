import {HTTP_STATUS_CODE} from '../types/httpStatusCodes';

export class HTTPError extends Error {
   public statusCode: HTTP_STATUS_CODE;
   constructor(message: string, statusCode: HTTP_STATUS_CODE) {
      super(message);
      this.statusCode = statusCode;
   }
}
