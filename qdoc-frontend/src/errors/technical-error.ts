// eslint-disable-next-line import/no-cycle
import BaseError from "./base-error";
// eslint-disable-next-line import/no-cycle
import { ApiErrorType } from "./error-response";

export default class TechnicalError extends BaseError {
  public constructor(message = "Internal Server Error", id = "") {
    super(500, ApiErrorType.technical, message, id);
  }
}
