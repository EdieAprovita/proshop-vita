import { Response } from "express";
import { User, IUser } from "../models/User";
import { BadRequestError, DataNotFoundError } from "../types/Errors";
import generateTokenAndSetCookie from "../utils/generateToken";

class UserService {
	async registerUser(
		userData: Pick<IUser, "username" | "email" | "password">,
		res: Response
	) {
		const { email, password, username } = userData;

		const userExists = await User.findOne({ email });

		if (userExists) {
			throw new BadRequestError("User already exists");
		}

		const user = await User.create({
			email,
			password,
			username,
		});

		generateTokenAndSetCookie(res, user._id);

		return {
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
			},
		};
	}

	async loginUser(email: string, password: string, res: Response) {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			throw new DataNotFoundError("User not found");
		}

		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			throw new BadRequestError("Invalid credentials");
		}

		generateTokenAndSetCookie(res, user._id);

		return {
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
			},
		};
	}

	async findAllUsers() {
		const users = await User.find({});
		return users.map(user => ({
			_id: user._id,
			username: user.username,
			email: user.email,
		}));
	}

	async findUserById(userId: string) {
		const user = await User.findById(userId);
		if (!user) {
			throw new DataNotFoundError("User not found");
		}
		return user;
	}

	async updateUserById(userId: string, updateData: Partial<IUser>) {
		const user = await User.findById(userId);
		if (!user) {
			throw new DataNotFoundError("User not found");
		}

		if (updateData.password) {
			user.password = updateData.password;
		}

		if (user) {
			user.username = updateData.username || user.username;
			user.email = updateData.email || user.email;
		}

		const updatedUser = await user.save();

		return updatedUser;
	}

	async deleteUserById(userId: string) {
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			throw new DataNotFoundError("User not found");
		}
		return { message: "User deleted successfully" };
	}
}

export default new UserService();