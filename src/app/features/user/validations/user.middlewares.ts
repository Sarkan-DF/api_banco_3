import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/util/http-response.adapter";

export const userCheck = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email) {
    return ApiResponse.notProvided(res, "Usuario");
  }

  if (!password) {
    return ApiResponse.notProvided(res, "Senha");
  }

  // if (!confirmPassword) {
  //   return ApiResponse.notProvided(res, "Confirmação de senha");
  // }
  next();
};
