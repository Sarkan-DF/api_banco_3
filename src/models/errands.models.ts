// import { v4 as createUuid2 } from "uuid";

import { randomUUID } from "crypto";
import { ErrandEntity } from "../database/entities/errand.entity";
import { User } from "./user.models";

export class Errands {
  public idErrands: string;
  constructor(
    private _title: string,
    private _description: string,
    private _user: User
  ) {
    this.idErrands = randomUUID();
  }

  public get title(): string {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get description(): string {
    return this._description;
  }

  public set description(description: string) {
    this._description = description;
  }

  public get user(): User {
    return this._user;
  }

  public toJsonE() {
    return {
      idErrands: this.idErrands,
      title: this._title,
      description: this._description,
      user: this._user?.toJson(),
    };
  }

  public static create(row: ErrandEntity, user: User) {
    const errand = new Errands(row.title, row.description, user);
    errand.idErrands = row.idErrands;

    return errand;
  }
}
