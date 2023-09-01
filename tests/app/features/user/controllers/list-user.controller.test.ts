import { Database } from "../../../../../src/main/database/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { Server } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user.models";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("testando listagem de usuario", () => {
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

    const cache = CacheDatabase.connection;
    await cache.flushall();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const sut = Server.create();

  const listUser = async (user: User[]) => {
    const repository = new UserRepository();
    await repository.list();
  };

  test("Deve retorna ok:true e code:201 quando listado com sucesso em cache", async () => {
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(true);

    const result = await supertest(sut).get("/users").send();

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result).toHaveProperty("body.ok");
    // expect(result).toHaveProperty("data");
    expect(result.body.message).toEqual(
      "Usuario(s) listado(s) com sucesso! (cache)"
    );
    console.log(result);
  });

  test("Deve retorna ok:true e code:201 quando listado com sucesso", async () => {
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(false);

    const result = await supertest(sut).get("/users").send();

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result).toHaveProperty("body.ok");
    // expect(result).toHaveProperty("data");
    expect(result.body.message).toEqual("Usuario(s) listado(s) com sucesso!");
    console.log(result);
  });
});
