import { Response } from "express";
import { Result } from "./result.contract";

export class ApiResponse {
  public static notFound(res: Response, entity: string) {
    return res.status(404).send({
      ok: false,
      message: `${entity} was not found`,
    });
  }

  public static success(res: Response, result: Result) {
    return res.status(result.code).send(result);
  }

  public static serverError(res: Response, error: any) {
    return res.status(500).send({
      ok: false,
      message: error.toString(),
    });
  }

  public static notProvided(res: Response, field: string) {
    return res.status(400).send({
      ok: false,
      message: `${field} was not provided!!!`,
    });
  }

  public static invalidField(res: Response, field: string) {
    return res.status(400).send({
      ok: false,
      message: `${field} is invalid`,
    });
  }

  public static badRequest(res: Response, message: string) {
    return res.status(400).send({
      ok: false,
      message,
    });
  }

  public static invalidCredentials(res: Response) {
    return res.status(401).send({
      ok: false,
      message: "Acesso não autorizado",
    });
  }
}
