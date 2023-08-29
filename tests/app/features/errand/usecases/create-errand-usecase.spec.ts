import { Database } from "../../../../../src/main/config/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { CreateErrandUsecase } from "../../../../../src/app/features/errand/usecases/create-errand.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { Errands } from "../../../../../src/app/models/errands.models";
import { User } from "../../../../../src/app/models/user.models";
import { ErrandReposity } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("CreateErrandUsecase", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
    jest.setTimeout(300000);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest
      .spyOn(ErrandReposity.prototype, "create")
      .mockResolvedValue(mockErrands);
    jest.spyOn(CacheRepository.prototype, "setEx").mockResolvedValue();
    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const createSut = () => {
    const sut = new CreateErrandUsecase();
    return sut;
  };

  const mockUser = new User("any_email", "any_senha");
  const mockErrands = new Errands("any_title", "any_description", mockUser);

  test("Deve retornar ok: false e code:404 quando não existir usuario", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      iduser: "any_iduser",
      description: "any_description",
      title: "any_title",
    });
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("User not found");
  });

  test("Deve retornar ok:true e code:201 quando o recado for criado com sucesso", async () => {
    const sut = createSut();

    const result = await sut.execute({
      iduser: "any_iduser",
      description: "any_description",
      title: "any_title",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual("Recado criado com sucesso!");
  });
});
