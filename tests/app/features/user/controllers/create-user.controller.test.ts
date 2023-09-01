import { Database } from "../../../../../src/main/database/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { Server } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user.models";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("testando criação de usuario", () => {
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
    const userRepository = database.getRepository(UserEntity);
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

  test("Deve retornar ok:false code:401 caso email não imformado", async () => {
    const result = await supertest(sut)
      .post("/users")
      .send({ password: "any_password" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Usuario não fornecido(a).");
  });

  test("Deve retornar ok:false code:401 caso senha não imformado", async () => {
    const result = await supertest(sut)
      .post("/users")
      .send({ email: "any_email" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Senha não fornecido(a).");
  });

  test("Deve retornar ok:false code:400 caso usuário já esteja cadastrado", async () => {
    const user = new User("any_email", "any_password");
    await createUser(user);

    const result = await supertest(sut)
      .post("/users")
      .send({ email: "any_email", password: "any_password" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Email invalido: já cadastrado!");
  });

  test("Deve retornar ok:true code:201 caso usuário cadastrado com sucesso", async () => {
    // const user = new User("any_email", "any_password");
    // await createUser(user);

    const result = await supertest(sut)
      .post("/users")
      .send({ email: "any_email", password: "any_password" });

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toEqual("Usuario criado com sucesso!");
  });
});
