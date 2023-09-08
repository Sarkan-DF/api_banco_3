import supertest from "supertest";
import { User } from "../../../../../src/app/models/user.models";
import { ErrandEntity } from "../../../../../src/app/shared/database/entities/errand.entity";
import { Server } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { Errands } from "../../../../../src/app/models/errands.models";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { ErrandReposity } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("Testando atualizar recado", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    const database = Database.connection;
    const userRepository = database.getRepository(ErrandEntity);
    await userRepository.clear();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const sut = Server.create();

  const user = new User("any_email", "any_password");
  const errand = new Errands("any_title", "any_description", user);

  const createUser = async (user: User) => {
    const repository = new UserRepository();
    await repository.create(user);
  };

  const createErrand = async (errand: Errands) => {
    const repository = new ErrandReposity();
    await repository.create(errand);
  };

  test("Deve retornar ok:false code:404 caso user não imformado ou não existir", async () => {
    // const user = new User("any_email", "any_password");
    // const errand = new Errands("any_title", "any_description", user);

    const result = await supertest(sut)
      .put(`/users/${user.idUser}/errands/${errand.idErrands}`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(404);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("User not found");
  });

  test("Deve retornar ok:false code:404 caso recado não imformado ou não existir", async () => {
    // const user = new User("any_email", "any_password");
    // const errand = new Errands("any_title", "any_description", user);

    await createUser(user);

    const result = await supertest(sut)
      .put(`/users/${user.idUser}/errands/${errand.idErrands}`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(404);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Errand not found");
  });

  test("Deve retornar ok:true code:201 caso recado alterado com sucesso com title e description informados", async () => {
    await createUser(user);

    await createErrand(errand);

    const result = await supertest(sut)
      .put(`/users/${user.idUser}/errands/${errand.idErrands}`)
      .send({ title: "any_title", description: "any_description" });

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toEqual("Errand updated successfully");
  });

  test("Deve retornar ok:true code:201 caso recado alterado com sucesso com somente title informado", async () => {
    await createUser(user);

    await createErrand(errand);

    const result = await supertest(sut)
      .put(`/users/${user.idUser}/errands/${errand.idErrands}`)
      .send({ title: "any_title" });

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toEqual("Errand updated successfully");
  });

  test("Deve retornar ok:true code:201 caso recado alterado com sucesso com somente description informado", async () => {
    await createUser(user);

    await createErrand(errand);

    const result = await supertest(sut)
      .put(`/users/${user.idUser}/errands/${errand.idErrands}`)
      .send({ description: "any_description" });

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toEqual("Errand updated successfully");
  });
});
