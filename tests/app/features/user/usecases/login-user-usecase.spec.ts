import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { LoginUserUsecase } from "../../../../../src/app/features/user/usecases/login-user.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { Database } from "../../../../../src/main/database/database.conection";

describe("LoginUserUsecase", () => {
  beforeAll(async () => {
    await Database.connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(mockUser);
    jest
      .spyOn(UserRepository.prototype, "getByPassword")
      .mockResolvedValue(mockUser);
  });

  afterAll(async () => {
    await Database.connection.destroy();
  });

  const createSut = () => {
    const sut = new LoginUserUsecase();
    return sut;
  };

  const mockUser = new User("any_email", "any_senha");

  // verificar se existe email não exista;
  test("Deve retornar ok:false e code:400 caso email não exista", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      email: "any_email",
      password: "any_senha",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("Email ou senha invalido: não enviado!");
  });

  // verificar se existe senha não exista;
  test("Deve retornar ok:false e code:400 caso senha não exista", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getByPassword")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      email: "any_email",
      password: "any_senha",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("Email ou senha invalido: não enviado!");
  });

  // Verificar se email está correto;
  test("Deve retornar ok:false e code:400 caso email esteja incorreto", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(new User("any_email_diferente", "any_senha"));

    const result = await sut.execute({
      email: "any_email",
      password: "any_senha",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("Email ou senha invalido: incorretos!");
  });

  // Verificar se senha está correta;
  test("Deve retornar ok:false e code:400 caso senha esteja incorreta", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(new User("any_email", "any_senha_diferente"));

    const result = await sut.execute({
      email: "any_email",
      password: "any_senha",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("data");
    expect(result.message).toEqual("Email ou senha invalido: incorretos!");
  });

  // verificar se senha informada e a mesmo do banco para logar o usuario;
  test("Deve retornar ok:true e code:201 quando logim for bem sucedido", async () => {
    const sut = createSut();

    const result = await sut.execute({
      email: "any_email",
      password: "any_senha",
    });

    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
    expect(result.message).toEqual("Login efetuado com sucesso!");
    expect(result.code).toBe(201);

    expect(result.data).toBeDefined();
    expect(result.data).toHaveProperty("idUser", mockUser.idUser);
    expect(result.data).toHaveProperty("email", mockUser.email);
  });
});
