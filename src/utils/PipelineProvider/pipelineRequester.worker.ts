import { parentPort, workerData } from 'worker_threads';
import { getPipeline } from '../../api/gitlab';

let requestParams = ['125_37747'];

function getPipelineData(projectId: number, pipelineId: number) {
    return new Promise((resolve, reject) => {
        getPipeline(projectId, pipelineId)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

function* requestPipelines() {
    // const batchCount
    requestParams.map((item) => {
        const [projectId, pipelineId] = item.split('_').map(parseInt);
        getPipelineData(projectId, pipelineId);
    });
}

setTimeout(() => {}, workerData.);

// console.log(process.env);
// if (parentPort) {
//    parentPort.postMessage(factorial(workerData.value));
// }
