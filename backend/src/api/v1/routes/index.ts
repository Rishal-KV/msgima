import express from "express";
import userRoutes from "./user/user.routes";

const v1Routes: express.Router = express.Router();

v1Routes.use("/user", userRoutes);

export default v1Routes;
