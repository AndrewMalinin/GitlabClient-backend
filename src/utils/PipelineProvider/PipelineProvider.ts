import Build from '../../models/Build';

class PipelineProvider {
    public config = {
        MAX_REQUESTS_PER_SECOND: 20,
        PIPELINE_REQUEST_INTERVAL_MS: 5000
    };

    private _pipelineIDQueue: Array<number> = [];

    constructor() {}

    public scanDB() {
        Build.find({ 'pipeline.approved': false }).lean().exec()
            .then((builds) => {
               builds.map((build)=>{
                  console.log(build.pipeline)
               })
               //console.log(build.pipeline)
            })
            .catch(() => {});
    }

    public addPipelineIDToQueue(pipelineID: number) {
        this._pipelineIDQueue.push(pipelineID);
    }

    private _updatePipelineData() {}
}

export const pipelineProvider = new PipelineProvider();
pipelineProvider.scanDB();
