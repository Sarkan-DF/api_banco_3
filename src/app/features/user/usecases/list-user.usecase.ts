import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

export class ListUserUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const repository = new UserRepository();

    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get("users-cache");

    if (cacheResult) {
      return {
        ok: true,
        message: "Usuario(s) listado(s) com sucesso! (cache)",
        code: 201,
        data: cacheResult,
      };
    }

    const result = await repository.list();

    const data = result.map((list) => list.toJson());

    await cacheRepository.set("users-cache", data);

    return {
      ok: true,
      message: "Usuario(s) listado(s) com sucesso!",
      code: 201,
      data: result.map((list) => list.toJson()),
    };
  }
}
