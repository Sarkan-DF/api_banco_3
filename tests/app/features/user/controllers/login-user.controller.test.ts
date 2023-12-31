import { Database } from "../../../../../src/main/database/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { Server } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user.models";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { UserControllers } from "../../../../../src/app/features/user/controllers/user.controller";

describe("testando login de usuario", () => {
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

  test("Deve retorna ok:false e code:400 quando email não informado", async () => {
    const result = await supertest(sut)
      .post("/users/login")
      .send({ password: "any_password" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Usuario não fornecido(a).");
  });

  test("Deve retorna ok:false e code:400 quando senha não informada", async () => {
    const result = await supertest(sut)
      .post("/users/login")
      .send({ email: "any_email" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result).toHaveProperty("body.ok");
    expect(result).not.toHaveProperty("data");
    expect(result.body.message).toEqual("Senha não fornecido(a).");
  });

  test("Deve retorna ok:true e code:201 quando login efetuado com sucesso", async () => {
    const resultCreate = await supertest(sut)
      .post("/users")
      .send({ email: "any_email", password: "any_password" });

    const resultLogin = await supertest(sut)
      .post("/users/login")
      .send({ email: "any_email", password: "any_password" });

    expect(resultLogin).toBeDefined();
    expect(resultLogin.status).toBe(201);
    expect(resultLogin.body.ok).toBe(true);
    expect(resultLogin).toHaveProperty("body.ok");
    expect(resultLogin.body.message).toEqual("Login efetuado com sucesso!");
  });

  test("Deve retornar code:500 caso ocorra erro no servido para efetuar login", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockImplementation(() => {
        throw new Error();
      });

    const result = await supertest(sut)
      .post("/users/login")
      .send({ email: "any_user", password: "any_password" });

    expect(result.status).toBe(500);
  });
});
