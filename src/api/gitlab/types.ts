import { PIPELINE_STATUS } from '../../models/Build/pipelineSchema';

export enum GITLAB_API_ENDPOINTS {
    GET_PIPELINE = '/projects/:projectId/pipelines/:pipelineId'
}

export interface IGitlabAPIRequest {
    [GITLAB_API_ENDPOINTS.GET_PIPELINE]: Record<string, never>;
}

export interface IGitlabAPIResponse {
    [GITLAB_API_ENDPOINTS.GET_PIPELINE]: {
        id: number;
        iid: number;
        project_id: number;
        status: PIPELINE_STATUS;
        user: {
            name: string;
            username: string;
            id: number;
            avatar_url: string;
            web_url: string;
        };
        created_at: string | null;
        updated_at: string | null;
        started_at: string | null;
        finished_at: string | null;
        duration: number;
        queued_duration: number;
        coverage: number;
        web_url: string;
    };
}
