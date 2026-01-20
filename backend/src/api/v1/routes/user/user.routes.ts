import express from "express";
import UserController from "../../controllers/user/user.controller";

const userRoutes: express.Router = express.Router();

// Auth routes

// // Protected routes
const userController = new UserController();

userRoutes.post("/create", userController.createUser);
userRoutes.get("/", userController.getAllUsers);

export default userRoutes;
