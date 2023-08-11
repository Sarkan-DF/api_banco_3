import { User } from "../../../models/user.models";
import { ApiResponse } from "../../../shared/util/http-response.adapter";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

export class ListUserUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const repository = new UserRepository();
    const result = await repository.list();

    return {
      ok: true,
      message: "Usuario criado com sucesso!",
      code: 201,
      data: result.map((list) => list.toJson()),
    };
  }
}
