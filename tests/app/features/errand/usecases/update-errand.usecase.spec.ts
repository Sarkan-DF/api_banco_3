import { CacheDatabase } from "../../../../../src/main/database/redis.connections";
import { UpdateErrandUsecase } from "../../../../../src/app/features/errand/usecases/update-errand.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { Errands } from "../../../../../src/app/models/errands.models";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { ErrandReposity } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { Database } from "../../../../../src/main/database/database.conection";

describe("UpdateErrandUsecase", () => {
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
    const sut = new UpdateErrandUsecase();
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
      iduser: mockUser.idUser,
      iderrands: mockErrand.idErrands,
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("User not found");
  });

  test("Deve retornar ok:false e code:404 quando não existir recado", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest
      .spyOn(ErrandReposity.prototype, "getByIdErrand")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      iduser: mockUser.idUser,
      iderrands: mockErrand.idErrands,
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("Errand not found");
  });

  test("Deve retornar ok:true e code:201 quando não enviado title e enviado description", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest
      .spyOn(ErrandReposity.prototype, "getByIdErrand")
      .mockResolvedValue(mockErrand);
    jest.spyOn(ErrandReposity.prototype, "update").mockResolvedValue();
    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute({
      iduser: mockUser.idUser,
      iderrands: mockErrand.idErrands,
      // title: "any_title",
      description: "any_description",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual("Errand updated successfully");
  });

  test("Deve retornar ok:true e code:201 quando enviado title e não enviado description", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest
      .spyOn(ErrandReposity.prototype, "getByIdErrand")
      .mockResolvedValue(mockErrand);
    jest.spyOn(ErrandReposity.prototype, "update").mockResolvedValue();
    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute({
      iduser: mockUser.idUser,
      iderrands: mockErrand.idErrands,
      title: "any_title",
      // description: "any_description",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual("Errand updated successfully");
  });

  test("Deve retornar ok:true e code:201 quando enviado title e description", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest
      .spyOn(ErrandReposity.prototype, "getByIdErrand")
      .mockResolvedValue(mockErrand);
    jest.spyOn(ErrandReposity.prototype, "update").mockResolvedValue();
    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute({
      iduser: mockUser.idUser,
      iderrands: mockErrand.idErrands,
      title: "any_title",
      description: "any_description",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual("Errand updated successfully");
  });

  //colocar resposta personalizado quando o usuario não envia nem title nem description
  test("Deve retornar ok:true e code:201 quando não enviado title e description", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest
      .spyOn(ErrandReposity.prototype, "getByIdErrand")
      .mockResolvedValue(mockErrand);
    jest.spyOn(ErrandReposity.prototype, "update").mockResolvedValue();
    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute({
      iduser: mockUser.idUser,
      iderrands: mockErrand.idErrands,
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("data");
    expect(result.message).toEqual("Errand updated successfully");
  });
});
