import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

interface loginUserParams {
  email: string;
  password: string;
}

export class LoginUserUsecase implements Usecase {
  public async execute(params: loginUserParams): Promise<Result> {
    const repository = new UserRepository();

    const existeByEmail = await repository.getByEmail(params.email);
    const existeByPassword = await repository.getByPassword(params.password);

    if (!existeByEmail || !existeByPassword) {
      return UsecaseResponse.invalidField("Email ou senha", "não enviado!");
    }

    if (existeByEmail.password != params.password) {
      return UsecaseResponse.invalidField("Email ou senha", "incorretos!");
    }

    const result = { idUser: existeByEmail.idUser, email: existeByEmail.email };

    return {
      ok: true,
      message: "Login efetuado com sucesso!",
      code: 201,
      data: result,
    };
  }
}
