import { Worker } from 'worker_threads';
import Build from '../../models/Build';
import path from 'path';
import { importWorker } from '..';
import { IPipeline } from '../../models/Build/pipelineSchema';

class PipelineProvider {
    public config = {
        MAX_REQUESTS_PER_SECOND: 20,
        PIPELINE_REQUEST_INTERVAL_MS: 5000
    };

    private _pipelineIDQueue: Array<string> = [];

    constructor() {
        const resolvedPath = require.resolve('./pipelineRequester.worker.ts');
        const worker = importWorker(resolvedPath, {
            workerData: {
                requestInterval: this.config.PIPELINE_REQUEST_INTERVAL_MS,
                requestsPerSecond: this.config.MAX_REQUESTS_PER_SECOND
            }
        });
        // worker.setEnvironmentData(''[, value])
        const array = new Uint32Array([11, 12, 13, 14, 15]);
        worker.on('message', (result) => {
            console.log(result);
        });
    }

    public scanDB() {
        return Build.find({ 'pipeline.approved': false })
            .lean()
            .exec()
            .then((builds) => {
                builds.map((build) => {
                    if (build.pipeline.gitlab_id) {
                        this._pipelineIDQueue.push(`${build.project.gitlab_id}_${build.pipeline.gitlab_id}`);
                    }
                });
            })
            .catch(() => {});
    }

    public addPipelineToQueue(projectId: number, pipelineId: number) {
        this._pipelineIDQueue.push(`${projectId}_${pipelineId}`);
    }

    private _updatePipelineData(pipelineData: IPipeline) {}
}

export const pipelineProvider = new PipelineProvider();
pipelineProvider.scanDB();
