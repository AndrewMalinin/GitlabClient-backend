require('dotenv').config();
import { parentPort } from 'worker_threads';
import { getPipeline } from '../../api/gitlab';
import { TWorkerMessage, WORKER_MESSAGE_TYPE } from './PipelineProvider';

function getPipelineData(projectId: number, pipelineId: number) {
    return new Promise((resolve, reject) => {
        getPipeline(projectId, pipelineId)
            .then((data) => {
                if (data.approved) {
                    resolve(
                        parentPort?.postMessage({
                            type: WORKER_MESSAGE_TYPE.APPROVE_PIPELINE,
                            data: {
                                projectId: projectId,
                                pipelineId: pipelineId,
                                data
                            }
                        } as TWorkerMessage)
                    );
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function requestAllQueue(queue: string[]) {
    queue.map((item) => {
        const [projectId, pipelineId] = item.split('_').map((str) => parseInt(str));
        getPipelineData(projectId, pipelineId).catch(() => {});
    });
}

function parseMainThreadMessage(msg: TWorkerMessage) {
    switch (msg.type) {
        case WORKER_MESSAGE_TYPE.UPDATE_QUEUE:
            requestAllQueue(msg.data.queue);
            break;

        default:
            break;
    }
}

parentPort?.on('message', parseMainThreadMessage);
