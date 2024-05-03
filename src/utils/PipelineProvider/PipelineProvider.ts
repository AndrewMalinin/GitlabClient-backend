import { Worker } from 'worker_threads';
import Build from '../../models/Build';
import { importWorker } from '..';
import { IPipeline } from '../../models/Build/pipelineSchema';

export enum WORKER_MESSAGE_TYPE {
    UPDATE_QUEUE = 'updateQueue',
    APPROVE_PIPELINE = 'approvePipeline'
}
export type TWorkerMessage =
    | {
          type: WORKER_MESSAGE_TYPE.UPDATE_QUEUE;
          data: {
              queue: string[];
          };
      }
    | {
          type: WORKER_MESSAGE_TYPE.APPROVE_PIPELINE;
          data: {
              projectId: number;
              pipelineId: number;
              data: IPipeline;
          };
      };

class PipelineProvider {
    public config = {
        MAX_REQUESTS_PER_SECOND: 20,
        PIPELINE_REQUEST_INTERVAL_S: 5
    };

    private _pipelinesQueue: Array<string> = [];
    private _batchSize = this.config.MAX_REQUESTS_PER_SECOND;
    private _currentBatchPosition = -1;
    private _worker: Worker | null = null;
    private _timer: any = null;

    constructor() {
        this._createWorker();
    }

    private parseWorkerMessage(msg: TWorkerMessage) {
        switch (msg.type) {
            case WORKER_MESSAGE_TYPE.APPROVE_PIPELINE:
                this._updatePipelineData(msg.data.pipelineId, msg.data.data)
                    .then(() => {
                        const idx = this._pipelinesQueue.indexOf(`${msg.data.projectId}_${msg.data.pipelineId}`);
                        if (idx > -1) {
                            this._pipelinesQueue.splice(idx, 1);
                        }
                    })
                    .catch(() => {});
                break;

            default:
                break;
        }
    }

    private _createWorker() {
        if (this._worker) {
            this._worker.terminate();
        }
        const resolvedPath = require.resolve('./pipelineRequester.worker.ts');
        this._worker = importWorker(resolvedPath, {});

        this._worker.on('message', this.parseWorkerMessage.bind(this));
    }

    public scanDB() {
        return Build.find({ 'pipeline.approved': false })
            .lean()
            .exec()
            .then((builds) => {
                builds.map((build) => {
                    if (build.pipeline.gitlab_id) {
                        this.addPipelineToQueue(build.project.gitlab_id, build.pipeline.gitlab_id);
                    }
                });
            })
            .catch(() => {});
    }

    public addPipelineToQueue(projectId: number, pipelineId: number) {
        this._pipelinesQueue.push(`${projectId}_${pipelineId}`);
        if (this._timer === null) {
            this._timer = setInterval(this._sendBatchToWorker.bind(this), 1000);
        }
    }

    private _sendBatchToWorker() {
        this._currentBatchPosition = ++this._currentBatchPosition % this.config.PIPELINE_REQUEST_INTERVAL_S;
        this._batchSize =
            this._pipelinesQueue.length >= this.config.PIPELINE_REQUEST_INTERVAL_S * this.config.MAX_REQUESTS_PER_SECOND
                ? this.config.MAX_REQUESTS_PER_SECOND
                : Math.floor(this._pipelinesQueue.length / this.config.PIPELINE_REQUEST_INTERVAL_S);
        if (this._batchSize === 0 && this._pipelinesQueue.length) {
            this._batchSize = 1;
        }
        const start = this._currentBatchPosition * this._batchSize;
        const end = start + this._batchSize;
        console.log(this._pipelinesQueue.slice(start, end))
        this._worker?.postMessage({
            type: WORKER_MESSAGE_TYPE.UPDATE_QUEUE,
            data: {
                queue: this._pipelinesQueue.slice(start, end)
            }
        } as TWorkerMessage);
    }

    private _updatePipelineData(pipelineId: number, pipelineData: IPipeline) {
        return Build.findOneAndUpdate(
            { id: pipelineId },
            {
                pipeline: pipelineData
            }
        );
    }

}

export const pipelineProvider = new PipelineProvider();
