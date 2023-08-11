import { User } from "../../../models/user.models";
import { ApiResponse } from "../../../shared/util/http-response.adapter";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

interface CreateUserParams {
  email: string;
  password: string;
}

export class CreateUserUsecase implements Usecase {
  public async execute(params: CreateUserParams): Promise<Result> {
    const repository = new UserRepository();
    const existeByEmail = await repository.getByEmail(params.email);

    if (existeByEmail) {
      return UsecaseResponse.invalidField("email", "já cadastrado!");
    }

    const user = new User(params.email, params.password);
    const result = await repository.create(user);

    return {
      ok: true,
      message: "Usuario criado com sucesso!",
      code: 201,
      data: result.toJson(),
    };
  }
}
