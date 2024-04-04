import { isValidObjectId } from "mongoose";

import { ValidationId } from "../types/Errors";

/**
 * Checks if the req.params.id is a valid Mongoose ObjectId.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @throws {Error} Throws an error if the ObjectId is invalid.
 */

export const checkObjectId = (req, res, next) => {
	if (!isValidObjectId(req.params.id)) {
		throw new ValidationId();
	}
	next();
};
