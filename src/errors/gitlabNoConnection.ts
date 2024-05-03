import { HTTP_STATUS_CODE } from '../types/httpStatusCodes';
import { HTTPError } from './index';

export class GitlabNoConnection extends HTTPError {
    constructor(message = 'Сервер Gitlab недоступен.') {
        super(message, HTTP_STATUS_CODE.GATEWAY_TIMEOUT);
    }
}
