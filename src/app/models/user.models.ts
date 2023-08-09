// import { v4 as createUuid2 } from "uuid";
import { randomUUID } from "crypto";
import { Errands } from "./errands.models";
import { UserEntity } from "../../database/entities/user.entity";

export class User {
  public idUser: string;
  private _errands: Errands[];
  constructor(
    private _email: string,
    private _password: string // private _confirmPassword: string
  ) {
    this.idUser = randomUUID();
    this._errands = [];
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  // public get confirmPassword(): string {
  //   return this._confirmPassword;
  // }

  public get errands(): Errands[] {
    return this._errands;
  }

  public toJson() {
    return {
      email: this._email,
      password: this._password,
      // confirmPassword: this._confirmPassword,
      idUser: this.idUser,
    };
  }

  public static create(row: UserEntity) {
    const user = new User(row.email, row.password);
    user.idUser = row.idUser;

    return user;
  }
}
