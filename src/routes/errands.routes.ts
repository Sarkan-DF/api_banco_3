import { Router } from "express";
import { UserControllers } from "../app/features/user/controllers/user.controller";
import { userCheck } from "../app/features/user/validations/user.middlewares";
import { ErrandsControllers } from "../controllers/errands.controller";
import { errandsCheck } from "../middlewares/errands.middlewares";

export const errandsRoutes = () => {
  const app = Router({ mergeParams: true });

  app.post("/", [errandsCheck], new ErrandsControllers().create);
  app.get("/", new ErrandsControllers().list);
  app.delete("/:iderrands", new ErrandsControllers().delete);
  app.put("/:iderrands", new ErrandsControllers().update);

  return app;
};
