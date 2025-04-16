// eslint-disable-next-line import/no-cycle
import TimeoutError from "./timeout-error";
// eslint-disable-next-line import/no-cycle
import BusinessError from "./business-error";
// eslint-disable-next-line import/no-cycle
import ValidationError from "./validation-error";
// eslint-disable-next-line import/no-cycle
import TechnicalError from "./technical-error";

export enum ApiErrorType {
  validation = "validation",
  technical = "technical",
  authorization = "authorization",
  business = "business",
  timeout = "timeout"
}

export type TimeoutErrorResponse = {
  id: string;
  type: ApiErrorType.timeout;
  message: string;
};

export type BusinessErrorResponse = {
  id: string;
  type: ApiErrorType.business;
  code: string;
  message: string;
};

export type ValidationErrorResponse = {
  id: string;
  type: ApiErrorType.validation;
  invalidParams: InvalidParam[];
};

export type TechnicalErrorResponse = {
  id: string;
  type: ApiErrorType.technical;
  message: string;
};

export type AuthorizationErrorResponse = {
  id: string;
  type: ApiErrorType.authorization;
  message: string;
};

export type InvalidParam = {
  name: string;
  reason: string;
};

export type ApiErrorResponse =
  | TimeoutErrorResponse
  | BusinessErrorResponse
  | ValidationErrorResponse
  | TechnicalErrorResponse
  | AuthorizationErrorResponse;

export type ApiError = TimeoutError | BusinessError | ValidationError | TechnicalError;
