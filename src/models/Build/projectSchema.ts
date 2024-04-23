import mongoose from 'mongoose';

export interface IProject {
    gitlab_id: number;
    name: string;
    namespace?: string;
    web_url: string;
}

const projectSchema = new mongoose.Schema<IProject>(
    {
        gitlab_id: {
            type: Number,
            required: true,
        },
        name: {
            type: String
        },
        namespace: {
            type: String
        },
        web_url: {
            type: String,
            required: true
        }
    },
    { versionKey: false, _id: false }
);

export default projectSchema;
