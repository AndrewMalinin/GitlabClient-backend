import { BadGatewayError } from './badGateway';

export class GitlabError extends BadGatewayError {
    constructor(errorMessage?: string) {
        super('Сервер Gitlab вернул ошибку' + (errorMessage ? `: ${errorMessage}` : '') + '.');
    }
}
