import { Product, IProduct } from "../models/Product";
import { DataNotFoundError } from "../types/Errors";
import { IReview } from "../models/Review";

class ProductService {
	async getAllProducts(pageNumber: number, keyword: string) {
		const perPage = 10;
		const page = pageNumber || 1;

		const query = keyword
			? {
					name: {
						$regex: keyword,
						$options: "i",
					},
				}
			: {};

		const count = await Product.countDocuments({ ...query });
		const products = await Product.find({ ...query })
			.limit(perPage)
			.skip(perPage * (page - 1));

		return {
			products,
			page,
			pages: Math.ceil(count / perPage),
		};
	}

	async getProductById(productId: string) {
		const product = await Product.findById(productId);
		if (!product) {
			throw new DataNotFoundError("Product not found");
		}
		return product;
	}

	async createProduct(productData: IProduct) {
		const product = await Product.create(productData);
		return product;
	}

	async updateProduct(productId: string, productData: IProduct) {
		const product = await Product.findById(productId);
		if (!product) {
			throw new DataNotFoundError("Product not found");
		}
		const updatedProduct = await Product.findByIdAndUpdate(productId, productData, {
			new: true,
			runValidators: true,
		});
		return updatedProduct;
	}

	async deleteProduct(productId: string) {
		const product = await Product.findById(productId);
		if (!product) {
			throw new DataNotFoundError("Product not found");
		}
		await product.deleteOne();
		return { message: "Product removed" };
	}

	async createProductReview(productId: string, reviewData: IReview) {
		const product = await Product.findById(productId);
		if (!product) {
			throw new DataNotFoundError("Product not found");
		}
		product.reviews.push(reviewData);
		product.numReviews = product.reviews.length;
		product.rating =
			product.reviews.reduce((acc, item) => item.rating + acc, 0) /
			product.reviews.length;
		await product.save();
		return { message: "Review added" };
	}

	async getTopProducts() {
		const products = await Product.find({}).sort({ rating: -1 }).limit(3);
		return products;
	}
}

export default new ProductService();
