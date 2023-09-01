import { Database } from "../../../../main/database/database.conection";
import { UserEntity } from "../../../shared/database/entities/user.entity";
import { User } from "../../../models/user.models";

export class UserRepository {
  private repository = Database.connection.getRepository(UserEntity);

  public async create(user: User) {
    const UserEntity = this.repository.create({
      idUser: user.idUser,
      email: user.email,
      password: user.password,
    });

    const result = await this.repository.save(UserEntity);
    return UserRepository.mapRowToModel(result);
  }

  public async list() {
    const result = await this.repository.find();

    return result.map((entity) => UserRepository.mapRowToModel(entity));
  }

  public async getByEmail(email: string) {
    const result = await this.repository.findOne({ where: { email } });

    if (!result) {
      return undefined;
    }

    return UserRepository.mapRowToModel(result);
  }

  public async getByPassword(password: string) {
    const result = await this.repository.findOne({ where: { password } });

    if (!result) {
      return undefined;
    }

    return UserRepository.mapRowToModel(result);
  }

  public async getById(idUser: string) {
    const result = await this.repository.findOneBy({ idUser });

    if (!result) {
      return undefined;
    }
    return UserRepository.mapRowToModel(result);
  }

  public static mapRowToModel(entity: UserEntity): User {
    return User.create(entity);
  }
}
