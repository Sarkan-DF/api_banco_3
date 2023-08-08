import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../util/http-response.adapter";

export const errandsCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;

  if (!title) {
    return ApiResponse.notProvided(res, "Titulo");
  }

  if (!description) {
    return ApiResponse.notProvided(res, "Descrição");
  }
  next();
};
