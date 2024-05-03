import { IPipeline, PIPELINE_STATUS } from '../../models/Build/pipelineSchema';
import GetPipeline_Command from './commands/getPipeline_command';
import { GITLAB_API_ENDPOINTS, IGitlabAPIResponse } from './types';

export async function getPipeline(projectId: number, pipelineId: number) {
    const data = await new GetPipeline_Command(projectId, pipelineId).setToken().send().catch(Promise.reject);
    //@ts-ignore
    return parsePipelineData(data);
}

function parsePipelineData(data: IGitlabAPIResponse[GITLAB_API_ENDPOINTS.GET_PIPELINE]): IPipeline {
    const s = data.status as PIPELINE_STATUS;
    return {
        gitlab_id: data.id,
        approved:
            s === PIPELINE_STATUS.CANCELED ||
            s === PIPELINE_STATUS.FAILED ||
            s === PIPELINE_STATUS.MANUAL ||
            s === PIPELINE_STATUS.SKIPPED ||
            s === PIPELINE_STATUS.SUCCESS,
        duration: data.duration,
        started_at: new Date(data.started_at || 0),
        finished_at: new Date(data.finished_at || 0),
        status: s,
        web_url: data.web_url
    };
}
