import { Errands } from "../../../models/errands.models";
import { ErradsReposity } from "../repositories/errand.repository";
import { UserRepository } from "../../user/repositories/user.repository";
import { ApiResponse } from "../../../shared/util/http-response.adapter";
import { Request, Response, response } from "express";
import { CreateErrandUsecase } from "../usecases/create-errand.usecase";
import { ListErrandUsecase } from "../usecases/list-errand.usecase";
import { DeleteErrandUsecase } from "../usecases/delete-errand.usecase";

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

      const user = await new UserRepository().getById(iduser);
      if (!user) {
        return ApiResponse.notFound(res, "Usuario");
      }

      const errandRepository = new ErradsReposity();
      const errand = await errandRepository.getByIdErrand(iderrands);

      if (!errand) {
        return ApiResponse.notFound(res, "Recado");
      }

      if (title) {
        errand.title = title;
      }

      if (description) {
        errand.description = description;
      }

      await errandRepository.update(errand);

      const errands = await errandRepository.list({
        idUser: iduser,
      });

      return ApiResponse.success(
        res,
        "Recado alterado com sucesso",
        errands.map((errand) => errand.toJsonE())
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }
}
