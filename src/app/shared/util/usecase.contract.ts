import { Result } from "./result.contract";

export class Usecase {
  public execute: (params?: any) => Promise<Result>;
}
