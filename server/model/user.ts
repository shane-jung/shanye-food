import bcrypt from 'bcryptjs';
import mongoose, { Model } from 'mongoose';

const { model, Schema } = mongoose;

interface IUser {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

interface IUserMethods {
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = model<IUser, UserModel>('User', userSchema);
export default User;
