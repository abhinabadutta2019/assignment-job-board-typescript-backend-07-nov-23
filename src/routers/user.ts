// import { User } from "../models/User";
import { Router } from "express";
const router = Router();
//
import { registerUser, loginUser } from "../controllers/userController";

//
router.post("/", registerUser);
router.post("/login", loginUser);

export { router as userRouter };
