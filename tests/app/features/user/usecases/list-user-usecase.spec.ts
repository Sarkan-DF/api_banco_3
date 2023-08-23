import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { ListUserUsecase } from "../../../../../src/app/features/user/usecases/list-user.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { Database } from "../../../../../src/main/config/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";

describe("ListUserUsecase", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();

    jest.setTimeout(300000);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const createSut = () => {
    const sut = new ListUserUsecase();
    return sut;
  };

  const mockUser = new User("any_email", "any_senha");
  const mockUsers: User[] = [mockUser];

  test("Deve retorna ok:true code:201 quando houver cache", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(true);

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data", result.data);
    expect(result.message).toEqual(
      "Usuario(s) listado(s) com sucesso! (cache)"
    );
  });

  test("Deve retorna ok:true code:201 quando não houver cache dai lista do banco mesmo", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
    jest.spyOn(UserRepository.prototype, "list").mockResolvedValue(mockUsers);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data", result.data);
    expect(result.message).toEqual("Usuario(s) listado(s) com sucesso!");
  });
});
