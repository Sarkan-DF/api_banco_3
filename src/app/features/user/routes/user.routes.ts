import { Router } from "express";
import { UserControllers } from "../controllers/user.controller";
import { userCheck } from "../validations/user.middlewares";
import { errandsRoutes } from "../../../../routes/errands.routes";
import { loginCheck } from "../validations/login.middlewares";

export const userRoutes = () => {
  const app = Router();

  app.post("/", [userCheck], new UserControllers().create);
  app.get("/", new UserControllers().list);

  app.post("/login", [loginCheck], new UserControllers().login);

  app.use("/:iduser/errands", errandsRoutes());

  return app;
};
