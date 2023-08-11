import { User } from "../../../models/user.models";
import { UserRepository } from "../repositories/user.repository";
import { ApiResponse } from "../../../shared/util/http-response.adapter";
import { Request, Response, response } from "express";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { ListUserUsecase } from "../usecases/list-user.usecase";
import { LoginUserUsecase } from "../usecases/login-user.usecase";

export class UserControllers {
  //Já refatorado para usecase
  public async create(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const usecase = new CreateUserUsecase();
      const result = await usecase.execute({ email, password });

      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }
  //Já refatorado para usecase
  public async list(req: Request, res: Response) {
    try {
      const usecase = new ListUserUsecase();
      const result = await usecase.execute();

      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }
  //Já refatorado para usecase
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const usecase = new LoginUserUsecase();
      const result = await usecase.execute({ email, password });

      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }
}
