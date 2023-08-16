import { Errands } from "../../../models/errands.models";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";

interface CreateErrandParams {
  title: string;
  description: string;
  iduser: string;
}

export class CreateErrandUsecase implements Usecase {
  public async execute(params: CreateErrandParams): Promise<Result> {
    const repository = new UserRepository();
    const user = await new UserRepository().getById(params.iduser);

    if (!user) {
      return UsecaseResponse.invalidField("Usuario", "não encontrado!");
    }

    const errand = new Errands(params.title, params.description, user);
    const result = await repository.create(user);

    return {
      ok: true,
      message: "Usuario criado com sucesso!",
      code: 201,
      data: result.toJson(),
    };
  }
}
