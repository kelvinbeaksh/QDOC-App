import { ApiError, ApiErrorResponse, TechnicalErrorResponse } from "./error-response";
import TechnicalError from "./technical-error";
import BusinessError from "./business-error";

export const deserializeError = (json: ApiErrorResponse): ApiError => {
  const technicalErrorJson = json as TechnicalErrorResponse;
  if (json.type === "business") {
    return new BusinessError(json.message, json.code, json.id);
  }
  return new TechnicalError(technicalErrorJson.message, technicalErrorJson.id);
};
