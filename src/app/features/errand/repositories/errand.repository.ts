import { Database } from "../../../../main/config/database.conection";
import { UserRepository } from "../../user/repositories/user.repository";
import { Errands } from "../../../models/errands.models";
import { ErrandEntity } from "../../../shared/database/entities/errand.entity";

interface ListTransactionsParams {
  idUser: string;
}
export class ErrandReposity {
  private repository = Database.connection.getRepository(ErrandEntity);

  public async create(errand: Errands) {
    const ErrandEntity = await this.repository.create({
      idErrands: errand.idErrands,
      title: errand.title,
      description: errand.description,
      idUser: errand.user.idUser,
    });

    await this.repository.save(ErrandEntity);
    const result = await this.repository.findOne({
      where: { idErrands: errand.idErrands },
      relations: { user: true },
    });
    return this.mapRowToModel(result!);
  }

  public async list(params: ListTransactionsParams) {
    const result = await this.repository.find({
      where: { idUser: params.idUser },
      relations: { user: true },
    });

    return result.map((row) => this.mapRowToModel(row));
  }

  public async delete(idErrands: string) {
    const result = await this.repository.delete({
      idErrands,
    });

    return result.affected ?? 0;
  }

  public async update(errand: Errands) {
    await this.repository.update(
      {
        idErrands: errand.idErrands,
      },
      {
        title: errand.title,
        description: errand.description,
      }
    );
  }

  public async getByIdErrand(idErrands: string) {
    const result = await this.repository.findOne({
      where: {
        idErrands,
      },
      relations: ["user"],
    });

    if (!result) {
      return undefined;
    }

    return this.mapRowToModel(result);
  }

  public mapRowToModel(entity: ErrandEntity) {
    const user = UserRepository.mapRowToModel(entity.user);
    return Errands.create(entity, user);
  }
}
