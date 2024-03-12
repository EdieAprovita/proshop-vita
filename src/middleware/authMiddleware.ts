import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import asyncHandler from "./asyncHandler";
import { NotAuthorizedError } from "../types/Errors";
import { User, IUser } from "../models/User";

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

/**
 * Get the JWT token from the request cookies
 * @param req The HTTP request
 * @returns The JWT token if present, otherwise undefined
 */
const getTokenFromCookies = (req: Request): string | undefined => {
	return req.cookies.jwt;
};

/**
 * Middleware to protect routes
 * @param req The HTTP request
 * @param res The HTTP response
 * @param next The next middleware in the chain
 */
export const protect = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const token = getTokenFromCookies(req);

		if (!token) {
			res.status(401);
			throw new NotAuthorizedError("Not authorized, no token");
		}

		try {
			const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);
			req.user = await User.findById(decodedToken.userId).select("-password");
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new NotAuthorizedError("Not authorized, token failed");
		}
	}
);

/**
 * Middleware to grant admin access
 * @param req The HTTP request
 * @param res The HTTP response
 * @param next The next middleware in the chain
 */
export const admin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user || !req.user.isAdmin) {
		res.status(401);
		throw new NotAuthorizedError("Not authorized as an admin");
	}
	next();
};
