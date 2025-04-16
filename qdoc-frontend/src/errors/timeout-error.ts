// eslint-disable-next-line import/no-cycle
import { ApiErrorType } from "./error-response";
// eslint-disable-next-line import/no-cycle
import BaseError from "./base-error";

export default class TimeoutError extends BaseError {
  public constructor(message = "Timeout Error", id = "") {
    super(408, ApiErrorType.timeout, message, id);
  }
}
