import { showErrorNotification } from "../../utils/notification-utils";
import { ApiErrorResponse, ApiErrorType } from "../../errors/error-response";
import { errorTitleMap } from "../../constants/error-messages";

const getErrorMessageTitle = (error: ApiErrorResponse): string => {
  let title;
  if (error.type === ApiErrorType.business) {
    title = errorTitleMap[error.code];
  }
  return title || `A ${error.type} error occurred`;
};

export const getErrorDescription = (error: ApiErrorResponse): string => {
  let description = error.type === ApiErrorType.validation ?
    error.invalidParams.map(param => param.reason).join(". ") : error.message;
  if (description === "Token session is not active") {
    description = "Your session has expired. You will be redirected to the login page.";
  }
  return description;
};

export const showError = (error: ApiErrorResponse): void => {
  if (error.type === ApiErrorType.timeout) {
    return;
  }
  showErrorNotification({
    message: getErrorMessageTitle(error),
    description: getErrorDescription(error)
  });
};
