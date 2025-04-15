// eslint-disable-next-line import/no-cycle
import { ApiErrorType } from "./error-response";

export default class BaseError extends Error {
  public readonly id: string;

  public readonly status: number;

  public readonly type: ApiErrorType;

  public constructor(status: number, type: ApiErrorType, message: string | undefined, id = "") {
    super(message || "");
    this.id = id || "-1"; // don't create new IDs for front-end
    this.type = type;
    this.status = status;
    Object.defineProperty(this, "id", {
      writable: false
    });
    Object.defineProperty(this, "message", {
      enumerable: true,
      writable: false
    });
    Object.defineProperty(this, "status", {
      enumerable: false,
      writable: false
    });
    Object.defineProperty(this, "type", {
      writable: false
    });
  }
}
