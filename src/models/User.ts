import mongoose from 'mongoose';

export interface IUser {
    gitlab_id: number;
    name: string;
    username: string;
}

const userSchema = new mongoose.Schema<IUser>(
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

export async function getUserOrCreate(userData: IUser) {
    let user = await User.findOne({ gitlab_id: userData.gitlab_id }).exec().catch(Promise.reject);
    if (!user) {
        user = await User.create(userData).catch(Promise.reject);
    }
    return user;
}

export default User;
