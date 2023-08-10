import { Errands } from "../../../models/errands.models";
import { ErradsReposity } from "../repositories/errand.repository";
import { UserRepository } from "../../user/repositories/user.repository";
import { ApiResponse } from "../../../shared/util/http-response.adapter";
import { Request, Response, response } from "express";

export class ErrandsControllers {
  public async create(req: Request, res: Response) {
    try {
      const { iduser } = req.params;
      const { title, description } = req.body;

      const user = await new UserRepository().getById(iduser);

      if (!user) {
        return ApiResponse.notFound(res, "Usuario não encontrado!");
      }

      const errand = new Errands(title, description, user);
      const result = await new ErradsReposity().create(errand);

      return ApiResponse.success(
        res,
        "Recado Criado com sucesso",
        result.toJsonE()
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const { iduser } = req.params;
      const user = await new UserRepository().getById(iduser);

      if (!user) {
        return ApiResponse.notFound(res, "Usuario não encontrado!");
      }

      const errand = await new ErradsReposity().list({ idUser: iduser });

      return ApiResponse.success(
        res,
        `Lista de recados do usuario ${user.email}`,
        errand.map((user) => user.toJsonE())
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { iduser, iderrands } = req.params;

      const user = await new UserRepository().getById(iduser);
      if (!user) {
        return ApiResponse.notFound(res, "Usuario");
      }

      const erradsReposity = new ErradsReposity();
      const deleteErrands = await erradsReposity.delete(iderrands);

      console.log(deleteErrands);

      if (deleteErrands == 0) {
        return ApiResponse.notFound(res, "Recados!!!!");
      }

      const errands = await erradsReposity.list({
        idUser: iduser,
      });

      return ApiResponse.success(
        res,
        "Recado deletado com sucesso",
        errands.map((errand) => errand.toJsonE())
      );
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
