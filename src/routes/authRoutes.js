import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", register);


authRouter.post("/login", login);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password/:token", resetPassword);

authRouter.post("/logout", protect, logout);

authRouter.get("/profile", protect, getProfile);

authRouter.put("/update-profile", protect, updateProfile);

export default authRouter;
