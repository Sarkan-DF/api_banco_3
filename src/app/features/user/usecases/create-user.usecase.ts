import { User } from "../../../models/user.models";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
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
      return UsecaseResponse.invalidField("Email", "já cadastrado!");
    }

    const user = new User(params.email, params.password);
    const result = await repository.create(user);

    const cacheRepository = new CacheRepository();
    await cacheRepository.setEx(`user-${user.email}`, 86400, result.toJson());

    await cacheRepository.delete("users-cache");

    return {
      ok: true,
      message: "Usuario criado com sucesso!",
      code: 201,
      data: result.toJson(),
    };
  }
}
