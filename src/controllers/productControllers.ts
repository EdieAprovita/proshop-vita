import "../types/global";
import { Request, Response, NextFunction } from "express";
import ProductService from "../services/ProductService";
import {
	BadRequestError,
	NotFoundError,
	InternalServerError,
	DataNotFoundError,
} from "../types/Errors";

export const getProducts: (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> = async (req, res, next) => {
	try {
		const { pageNumber = 1, keyword = "" } = req.query;
		const result = await ProductService.getAllProducts(
			Number(pageNumber),
			String(keyword)
		);
		res.json(result);
	} catch (error) {
		next(new InternalServerError("Internal Server Error"));
	}
};

export const getProductById: (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> = async (req, res, next) => {
	try {
		const product = await ProductService.getProductById(req.params.id);
		res.json(product);
	} catch (error) {
		if (error instanceof DataNotFoundError) {
			next(new NotFoundError("Product not found"));
		} else {
			next(new InternalServerError("Internal Server Error"));
		}
	}
};

export const createProduct: (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> = async (req, res, next) => {
	try {
		const createdProduct = await ProductService.createProduct(req.body);
		res.status(201).json(createdProduct);
	} catch (error) {
		next(new BadRequestError("Invalid data"));
	}
};

export const updateProduct: (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> = async (req, res, next) => {
	try {
		const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
		res.json(updatedProduct);
	} catch (error) {
		if (error instanceof DataNotFoundError) {
			next(new NotFoundError("Product not found"));
		} else {
			next(new InternalServerError("Internal Server Error"));
		}
	}
};

export const deleteProduct: (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> = async (req, res, next) => {
	try {
		await ProductService.deleteProduct(req.params.id);
		res.json({ message: "Product removed" });
	} catch (error) {
		if (error instanceof DataNotFoundError) {
			next(new NotFoundError("Product not found"));
		} else {
			next(new InternalServerError("Internal Server Error"));
		}
	}
};

export const createProductReview: (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> = async (req, res, next) => {
	try {
		const reviewData = {
			...req.body,
			userId: req.user?._id,
		};
		await ProductService.createProductReview(req.params.id, reviewData);
		res.status(201).json({ message: "Review added" });
	} catch (error) {
		next(new BadRequestError("Invalid data"));
	}
};

export const getTopProducts: (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> = async (req, res, next) => {
	try {
		const products = await ProductService.getTopProducts();
		res.json(products);
	} catch (error) {
		next(new InternalServerError("Internal Server Error"));
	}
};
