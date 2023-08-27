import { Errands } from "../../../models/errands.models";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandReposity } from "../repositories/errand.repository";

interface CreateErrandParams {
  title: string;
  description: string;
  iduser: string;
}

export class CreateErrandUsecase implements Usecase {
  public async execute(params: CreateErrandParams): Promise<Result> {
    const repository = new ErrandReposity();
    const user = await new UserRepository().getById(params.iduser);

    if (!user) {
      return UsecaseResponse.notFound("User");
    }

    const errand = new Errands(params.title, params.description, user);
    await repository.create(errand);

    const cacheRepository = new CacheRepository();
    await cacheRepository.setEx(
      `errand-${user.email}`,
      86400,
      errand.toJsonE()
    );

    await cacheRepository.delete("errands-cache");

    return {
      ok: true,
      message: "Recado criado com sucesso!",
      code: 201,
      data: errand.toJsonE(),
    };
  }
}
