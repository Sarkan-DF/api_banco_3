import { Errands } from "../../../models/errands.models";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErradsReposity } from "../repositories/errand.repository";

export class ListErrandUsecase implements Usecase {
  public async execute(idUser: string): Promise<Result> {
    const repository = new UserRepository();
    const user = await repository.getById(idUser);

    if (!user) {
      return UsecaseResponse.notFound("Usuario não encontrado!");
    }

    const result = await new ErradsReposity().list({ idUser });

    return {
      ok: true,
      message: `Recados de ${user.email} listados com sucesso!`,
      code: 201,
      data: result.map((item) => item.toJsonE()),
    };
  }
}
