import { HTTP_METHOD } from '../../../types';
import { GITLAB_API_ENDPOINTS } from '../types';
import Command, { IAbstractCommand_Params } from './_abstract_command';

export default class GetPipeline_Command extends Command<GITLAB_API_ENDPOINTS.GET_PIPELINE> {
    _apiPrefix = '/api/v4';
    _method = HTTP_METHOD.GET;
    _path = GITLAB_API_ENDPOINTS.GET_PIPELINE;
    _params: IAbstractCommand_Params<GITLAB_API_ENDPOINTS.GET_PIPELINE>;

    constructor(projectId: number, pipelineId: number) {
        super();
        this._params = {
            params: {
                projectId,
                pipelineId
            }
        };
    }
}
