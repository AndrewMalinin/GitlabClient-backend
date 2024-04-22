import mongoose, { Schema } from 'mongoose';
import projectSchema from './projectSchema';
import pipelineSchema from './pipelineSchema';
import variablesSchema from './variablesSchema';

const buildSchema = new mongoose.Schema(
    {
        project: {
            type: projectSchema,
            required: true
        },
        variables: variablesSchema,
        defines: [Schema.Types.Mixed],
        pipeline: {
            type: pipelineSchema,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        initiator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { versionKey: false }
);

const Build = mongoose.model('Build', buildSchema);
export default Build;
