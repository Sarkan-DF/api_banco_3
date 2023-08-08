import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../util/http-response.adapter";

export const loginCheck = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email) {
    return ApiResponse.notProvided(res, "Usuario");
  }

  if (!password) {
    return ApiResponse.notProvided(res, "Senha");
  }

  next();
};
