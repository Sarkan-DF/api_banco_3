import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { DeleteErrandUsecase } from "../../../../../src/app/features/errand/usecases/delete-errand.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.models";
import { Errands } from "../../../../../src/app/models/errands.models";
import { ErrandReposity } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { Database } from "../../../../../src/main/database/database.conection";

describe("DeleteErrandUsecase", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
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
    const sut = new DeleteErrandUsecase();
    return sut;
  };

  const mockUser = new User("any_email", "any_senha");
  const mockErrand = new Errands("any_title", "any_description", mockUser);

  test("Deve retornar ok:false e code:404 quando não existir usuario", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      iderrands: mockErrand.idErrands,
      iduser: mockUser.idUser,
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("User not found");
  });

  test("Deve retornar ok:false e code:404 quando recado não existir", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest.spyOn(ErrandReposity.prototype, "delete").mockResolvedValue(0);

    const result = await sut.execute({
      iderrands: mockErrand.idErrands,
      iduser: mockUser.idUser,
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("Errand not found");
  });

  test("Deve retornar ok:true e code:201 quando recado deletado com sucesso", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest.spyOn(ErrandReposity.prototype, "delete").mockResolvedValue(1);
    jest
      .spyOn(ErrandReposity.prototype, "list")
      .mockResolvedValue([mockErrand]);
    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute({
      iderrands: mockErrand.idErrands,
      iduser: mockUser.idUser,
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual("Errand successfully deleted");
  });
});
