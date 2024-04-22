import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        gitlab_id: {
            type: Number,
            required: true,
            unique: true
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
    { versionKey: false }
);

export default projectSchema;
