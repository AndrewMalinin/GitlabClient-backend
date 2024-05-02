import mongoose, { Schema } from 'mongoose';
import projectSchema, { IProject } from './projectSchema';
import pipelineSchema, { IPipeline } from './pipelineSchema';
import variablesSchema, { IVariables } from './variablesSchema';
import { IUser } from '../User';

export interface IBuild {
    /**
     * Pipeline GitLab ID
     *
     * @type {number}
     * @memberof IBuild
     */
    id: number;
    branch: string;
    initiator: IUser;
    project: IProject;
    variables: IVariables;
    defines: any[];
    pipeline: IPipeline;
    created_at: Date;
}

const buildSchema = new mongoose.Schema<IBuild>(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
            index: true
        },
        project: {
            type: projectSchema
        },
        variables: variablesSchema,
        defines: [Schema.Types.Mixed],
        pipeline: {
            type: pipelineSchema
        },
        branch: {
            type: String,
            required: true
        },
        initiator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
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
