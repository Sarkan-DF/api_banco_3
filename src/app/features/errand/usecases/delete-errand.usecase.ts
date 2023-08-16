import { Errands } from "../../../models/errands.models";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErradsReposity } from "../repositories/errand.repository";

interface DeleteErrandParams {
  iderrands: string;
  iduser: string;
}

export class DeleteErrandUsecase implements Usecase {
  public async execute(params: DeleteErrandParams): Promise<Result> {
    const repository = new UserRepository();
    const user = await repository.getById(params.iduser);

    if (!user) {
      return UsecaseResponse.notFound("Usuario não encontrado!");
    }

    const erradsReposity = new ErradsReposity();
    const deleteErrands = await erradsReposity.delete(params.iderrands);

    if (deleteErrands == 0) {
      return UsecaseResponse.notFound("Recado");
    }

    const result = await erradsReposity.list({ idUser: params.iduser });

    return {
      ok: true,
      message: `Recado deletado com sucesso!`,
      code: 201,
      data: result.map((item) => item.toJsonE()),
    };
  }
}
