// eslint-disable-next-line import/no-cycle
import { InvalidParam } from "./error-response";

const fromValidateJSError = (validateJSErrors: { [key: string]: string[] | undefined }): InvalidParam[] => {
  const invalidParams: InvalidParam[] = [];

  Object.keys(validateJSErrors).forEach(name => {
    const errorList = validateJSErrors[name];
    if (errorList !== undefined) {
      errorList.forEach((reason: string) => {
        invalidParams.push({ name, reason });
      });
    }
  });
  return invalidParams;
};

const toValidateJSError = (invalidParams: InvalidParam[]): { [key: string]: string[] } => {
  const validateJSErrors: { [keys: string]: string[] } = {};

  invalidParams.forEach(invalidParm => {
    if (!validateJSErrors[invalidParm.name]) {
      validateJSErrors[invalidParm.name] = [];
    }
    validateJSErrors[invalidParm.name].push(invalidParm.reason);
  });
  return validateJSErrors;
};

export const invalidParamMapper = {
  fromValidateJSError,
  toValidateJSError
};
