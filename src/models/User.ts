import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        gitlab_id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    { versionKey: false }
);

const User = mongoose.model('User', userSchema);
export default User;
