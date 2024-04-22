import mongoose from 'mongoose';

export enum PIPELINE_STATUS {
    // Gitlab API
    CANCELED = 'canceled',
    CREATED = 'created',
    FAILED = 'failed',
    MANUAL = 'manual',
    PENDING = 'pending',
    PREPARING = 'preparing',
    RUNNING = 'running',
    SCHEDULED = 'scheduled',
    SKIPPED = 'skipped',
    SUCCESS = 'success',
    WAITING_FOR_RESOURCE = 'waiting_for_resource',
    // Internal
    UNKNOWN = 'unknown'
}

const pipelineSchema = new mongoose.Schema(
    {
        // Id пайплайна на гитлабе
        gitlab_id: {
            type: Number,
            required: true
        },
        // True если статус пайплайна был подтверждён воркером,
        // запрашивающим статусы пайплайнов после запуска
        approved: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: [
                PIPELINE_STATUS.CANCELED,
                PIPELINE_STATUS.CREATED,
                PIPELINE_STATUS.FAILED,
                PIPELINE_STATUS.MANUAL,
                PIPELINE_STATUS.PENDING,
                PIPELINE_STATUS.PREPARING,
                PIPELINE_STATUS.RUNNING,
                PIPELINE_STATUS.SCHEDULED,
                PIPELINE_STATUS.SKIPPED,
                PIPELINE_STATUS.SUCCESS,
                PIPELINE_STATUS.UNKNOWN,
                PIPELINE_STATUS.WAITING_FOR_RESOURCE
            ],
            required: true
        },
        started_at: {
            type: Date
        },
        finished_at: {
            type: Date
        },
        duration: {
            type: Number
        },
        web_url: {
            type: String
        }
    },
    { versionKey: false }
);

export default pipelineSchema;
