import bcrypt from "bcryptjs";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
	matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
	if (this.email) {
		this.email = this.email.toLowerCase();
	}
	next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
