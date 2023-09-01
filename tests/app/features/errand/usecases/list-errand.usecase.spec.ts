import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { ListErrandUsecase } from "../../../../../src/app/features/errand/usecases/list-errand.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { Database } from "../../../../../src/main/database/database.conection";
describe("ListErrandUsecase", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue("any_errans-cache");
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const createSut = () => {
    const sut = new ListErrandUsecase();
    return sut;
  };

  const mockUser = new User("any_email", "any_senha");

  test("Deve retornar ok:false e code:404 quando não existir usuario", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValue(undefined);

    const result = await sut.execute(mockUser.idUser);

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("User not found");
  });

  test("Deve retornar ok:true e code:201 quando existir lista em cache", async () => {
    const sut = createSut();

    const result = await sut.execute(mockUser.idUser);

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual(
      `Recados de ${mockUser.email} listados com sucesso! (Cache)`
    );
  });

  test("Deve retornar ok:true e code:201 quando não existir lista em cache retorna lista normal", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);

    const result = await sut.execute(mockUser.idUser);

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual(
      `Recados de ${mockUser.email} listados com sucesso!`
    );
  });
});
