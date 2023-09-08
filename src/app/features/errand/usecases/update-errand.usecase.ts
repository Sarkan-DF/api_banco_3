import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandReposity } from "../repositories/errand.repository";

interface UpdateErrandParams {
  iderrands: string;
  iduser: string;
  title?: string;
  description?: string;
}

export class UpdateErrandUsecase implements Usecase {
  public async execute(params: UpdateErrandParams): Promise<Result> {
    const repository = new UserRepository();
    const user = await repository.getById(params.iduser);

    if (!user) {
      return UsecaseResponse.notFound("User");
    }

    const errandRepository = new ErrandReposity();
    const errand = await errandRepository.getByIdErrand(params.iderrands);

    if (!errand) {
      return UsecaseResponse.notFound("Errand");
    }

    if (params.title) {
      errand.title = params.title;
    }

    if (params.description) {
      errand.description = params.description;
    }

    await errandRepository.update(errand);

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete("errands-cache");

    const result = await errandRepository.list({ idUser: params.iduser });

    return {
      ok: true,
      message: `Errand updated successfully`,
      code: 201,
      data: result.map((item) => item.toJsonE()),
    };
  }
}
