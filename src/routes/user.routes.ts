import { Router } from "express";
import { UserControllers } from "../controllers/user.controller";
import { userCheck } from "../middlewares/user.middlewares";
import { errandsRoutes } from "./errands.routes";
import { loginCheck } from "../middlewares/login.middlewares";

export const userRoutes = () => {
  const app = Router();

  app.post("/", [userCheck], new UserControllers().create);
  app.get("/", new UserControllers().list);

  app.post("/login", [loginCheck], new UserControllers().login);

  app.use("/:iduser/errands", errandsRoutes());

  return app;
};
