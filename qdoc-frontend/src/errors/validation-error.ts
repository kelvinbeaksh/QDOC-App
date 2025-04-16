// eslint-disable-next-line import/no-cycle
import BaseError from "./base-error";
// eslint-disable-next-line import/no-cycle
import { ApiErrorType, InvalidParam } from "./error-response";
// eslint-disable-next-line import/no-cycle
import { invalidParamMapper } from "./invalid-param-mapper";
// eslint-disable-next-line import/no-cycle

export default class ValidationError extends BaseError {
  public readonly invalidParams: InvalidParam[];

  private constructor(invalidParams: InvalidParam[], id = "") {
    super(400, ApiErrorType.validation, undefined, id);

    this.invalidParams = invalidParams;

    Object.defineProperty(this, "invalidParams", { writable: false });
    Object.defineProperty(this, "message", {
      enumerable: false,
      writable: false
    });
  }

  public static from(
    {
      validateJsErrors,
      invalidParams
    }: {
      validateJsErrors?: { [keys: string]: string[] | undefined };
      invalidParams?: InvalidParam[];
    },
    id = ""
  ): ValidationError {
    if (validateJsErrors) {
      return ValidationError.fromValidateJs(validateJsErrors, id);
    }
    if (invalidParams) {
      return ValidationError.fromInvalidParam(invalidParams, id);
    }

    return new ValidationError([]);
  }

  private static fromValidateJs(input: { [keys: string]: string[] | undefined }, id: string): ValidationError {
    return new ValidationError(invalidParamMapper.fromValidateJSError(input), id);
  }

  private static fromInvalidParam(invalidParams: InvalidParam[], id: string): ValidationError {
    return new ValidationError(invalidParams, id);
  }
}
