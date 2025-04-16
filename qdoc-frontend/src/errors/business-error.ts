// eslint-disable-next-line import/no-cycle
import BaseError from "./base-error";
// eslint-disable-next-line import/no-cycle
import { ApiErrorType } from "./error-response";

export default class BusinessError extends BaseError {
  public readonly code: string;

  public constructor(message: string, code: string, id = "") {
    super(400, ApiErrorType.business, message, id);
    this.code = code;

    Object.defineProperty(this, "code", {
      writable: false
    });
  }
}
