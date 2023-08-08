import { User } from "../models/user.models";
import { UserRepository } from "../repositorys/user.repository";
import { ApiResponse } from "../util/http-response.adapter";
import { Request, Response, response } from "express";

export class UserControllers {
  public async create(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const repository = new UserRepository();

      const existeByEmail = await repository.getByEmail(email);

      if (existeByEmail) {
        return ApiResponse.notProvided(res, "Email já existe no banco!!!");
      }

      const user = new User(email, password);
      const result = await repository.create(user);

      return ApiResponse.success(
        res,
        "Usuario criado com sucesso!",
        result.toJson()
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const repository = new UserRepository();
      const result = await repository.list();

      return ApiResponse.success(
        res,
        "Lista de usuarios",
        result.map((users) => users.toJson())
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const repository = new UserRepository();
      const login = await new UserRepository().getByEmail(email);

      const existeByEmail = await repository.getByEmail(email);
      const existeByPassword = await repository.getByPassword(password);

      if (!existeByEmail || !existeByPassword) {
        return ApiResponse.invalidCredentials(res);
      }

      return ApiResponse.success(res, "Logim efetuado com sucesso!", {
        idUser: login?.idUser,
        email: login?.email,
      });
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }
}
