import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandReposity } from "../repositories/errand.repository";

export class ListErrandUsecase implements Usecase {
  public async execute(idUser: string): Promise<Result> {
    const repository = new UserRepository();
    const user = await repository.getById(idUser);

    if (!user) {
      return UsecaseResponse.notFound("User");
    }

    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get("errands-cache");

    if (cacheResult) {
      return {
        ok: true,
        message: `Recados de ${user.email} listados com sucesso! (Cache)`,
        code: 201,
        data: cacheResult,
      };
    }

    //testado até aqui!!!

    const result = await new ErrandReposity().list({ idUser });

    const data = result.map((list) => list.toJsonE());

    await cacheRepository.set("errands-cache", data);

    return {
      ok: true,
      message: `Recados de ${user.email} listados com sucesso!`,
      code: 201,
      data: result.map((item) => item.toJsonE()),
    };
  }
}
