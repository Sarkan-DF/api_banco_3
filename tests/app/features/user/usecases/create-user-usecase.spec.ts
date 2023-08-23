import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { Database } from "../../../../../src/main/config/database.conection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connections";

describe("CreateUserUsecase", () => {
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
    const sut = new CreateUserUsecase();
    return sut;
  };

  const mockUser = new User("any_email", "any_senha");

  test("Deve retorna ok:false code:400 quando email já existe", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(mockUser);

    const result = await sut.execute({
      email: "any_email",
      password: "any_senha",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("Email invalido: já cadastrado!");
  });

  test("Deve retorna ok:true code:201 quando usuario for criado com sucesso", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(mockUser);
    jest.spyOn(UserRepository.prototype, "create").mockResolvedValue(mockUser);
    jest.spyOn(CacheRepository.prototype, "setEx").mockResolvedValue();
    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute({
      email: "any_email",
      password: "any_senha",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toBe(true);
    expect(result.message).toEqual("Usuario criado com sucesso!");
  });
});
