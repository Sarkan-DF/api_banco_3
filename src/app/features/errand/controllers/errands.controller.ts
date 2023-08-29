import { UserRepository } from "../../user/repositories/user.repository";
import { ApiResponse } from "../../../shared/util/http-response.adapter";
import { Request, Response, response } from "express";
import { CreateErrandUsecase } from "../usecases/create-errand.usecase";
import { ListErrandUsecase } from "../usecases/list-errand.usecase";
import { DeleteErrandUsecase } from "../usecases/delete-errand.usecase";
import { UpdateErrandUsecase } from "../usecases/update-errand.usecase";

export class ErrandsControllers {
  public async create(req: Request, res: Response) {
    try {
      const { iduser } = req.params;
      const { title, description } = req.body;

      const usecase = new CreateErrandUsecase();
      const result = await usecase.execute({ title, description, iduser });

      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const { iduser } = req.params;

      const usecase = new ListErrandUsecase();
      const result = await usecase.execute(iduser);

      const user = await new UserRepository().getById(iduser);

      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { iduser, iderrands } = req.params;

      const usecase = new DeleteErrandUsecase();
      const result = await usecase.execute({ iduser, iderrands });

      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { iduser, iderrands } = req.params;
      const { title, description } = req.body;

      const usecase = new UpdateErrandUsecase();
      const result = await usecase.execute({
        iduser,
        iderrands,
        title,
        description,
      });

      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }
}
