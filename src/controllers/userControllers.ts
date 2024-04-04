import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { userService as UserService } from "../services/UserService";
import { BadRequestError, NotFoundError, NotAuthorizedError } from "../types/Errors";

/**
 * @description Register a new user
 * @name authUser
 * @route POST /api/v1/users/register
 * @access public
 * @returns {Promise<Response>}
 */

export const registerUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.registerUser(req.body, res);
			res.status(201).json(result);
		} catch (error) {
			if (error instanceof BadRequestError) {
				res.status(400).json({ error: error.message });
			} else {
				next(error);
			}
		}
	}
);

/**
 * @description Authenticated user and get token
 * @name authUser
 * @route POST /api/v1/users/login
 * @access public
 * @returns {Promise<Response>}
 */

export const loginUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;
			const result = await UserService.loginUser(email, password, res);
			res.status(200).json(result);
		} catch (error) {
			throw new NotAuthorizedError("Invalid credentials");
		}
		next();
	}
);

/**
 * @description Get all users
 * @name getUsers
 * @route GET /api/v1/users
 * @access private
 * @returns {Promise<Response>}
 */

export const getUsers = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.findAllUsers();
			res.status(200).json(result);
		} catch (error) {
			throw new NotFoundError("Users not found");
		}
		next();
	}
);

/**
 * @description Get user by id
 * @name getUserById
 * @route GET /api/v1/users/:id
 * @access private
 * @returns {Promise<Response>}
 */

export const getUserById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.findUserById(req.params.id);
			res.status(200).json(result);
		} catch (error) {
			throw new NotFoundError("User not found");
		}
		next();
	}
);

/**
 * @description Update user by id
 * @name updateUser
 * @route PUT /api/v1/users/:id
 * @access private
 * @returns {Promise<Response>}
 */

export const updateUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.params.id;
			const updateUser = await UserService.updateUserById(userId, req.body);
			res.status(200).json(updateUser);
		} catch (error) {
			throw new NotFoundError("User not found");
		}
		next();
	}
);

/**
 * @description Logout user
 * @name logout
 * @route POST /api/v1/users/logout
 * @access public
 */

export const logout = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.logoutUser(res);
			res.status(200).json(result);
		} catch (error) {
			throw new BadRequestError("Invalid request");
		}
		next();
	}
);

/**
 * @description Delete user by id
 * @name deleteUser
 * @route DELETE /api/v1/users/:id
 * @access private
 * @returns {Promise<Response>}
 */

export const deleteUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.deleteUserById(req.params.id);
			res.status(200).json(result);
		} catch (error) {
			throw new NotAuthorizedError("Not authorized");
		}
		next();
	}
);
