import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	createProductReview,
	getTopProducts,
} from "../controllers/productControllers";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/:id/reviews", protect, createProductReview);
router.get("/top", getTopProducts);

export default router;
