import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import {
	registerUser,
	loginUser,
	getUsers,
	getUserById,
	updateUser,
	logout,
	deleteUser,
} from "../controllers/userControllers";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
