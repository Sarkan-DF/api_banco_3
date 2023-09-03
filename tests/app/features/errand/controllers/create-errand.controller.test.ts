import supertest from "supertest";
import { ErrandEntity } from "../../../../../src/app/shared/database/entities/errand.entity";
import { Server } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { User } from "../../../../../src/app/models/user.models";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { CreateErrandUsecase } from "../../../../../src/app/features/errand/usecases/create-errand.usecase";
import { Errands } from "../../../../../src/app/models/errands.models";
import { ErrandReposity } from "../../../../../src/app/features/errand/repositories/errand.repository";

describe("testando criação de recados", () => {
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

  const createUser = async (user: User) => {
    const repository = new UserRepository();
    await repository.create(user);
  };

  test("Deve retornar ok:false code:400 caso title não imformado", async () => {
    const user = new User("any_email", "any_password");
    const result = await supertest(sut)
      .post(`/users/${user.idUser}/errands`)
      .send({ description: "any_description" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Titulo não fornecido(a).");
  });

  test("Deve retornar ok:false code:400 caso description não imformada", async () => {
    const user = new User("any_email", "any_password");
    const result = await supertest(sut)
      .post(`/users/${user.idUser}/errands`)
      .send({ title: "any_title" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Descrição não fornecido(a).");
  });

  test("Deve retornar ok:false code:404 caso user não existir", async () => {
    // const user = new User("any_email", "any_password");
    // await createUser(user);
    const result = await supertest(sut)
      .post(`/users/any_idUser/errands`)
      .send({ title: "any_title", description: "any_description" });

    expect(result).toBeDefined();
    expect(result.status).toBe(404);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("User not found");
  });

  test("Deve retornar ok:false code:201 caso recado criado com sucesso", async () => {
    const user = new User("any_email", "any_password");
    await createUser(user);

    const result = await supertest(sut)
      .post(`/users/${user.idUser}/errands`)
      .send({ title: "any_title", description: "any_description" });

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result).toHaveProperty("body.ok");
    // expect(result).toHaveProperty("data");
    expect(result.body.message).toEqual("Recado criado com sucesso!");
  });
});
