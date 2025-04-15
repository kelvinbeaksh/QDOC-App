import ValidationError from "../../src/errors/validation-error";
import { ApiErrorType } from "../../src/errors/error-response";

const validationSample = {
  id: "fake-uuid",
  invalidParams: [ { name: "error", reason: "reason" } ],
  type: "validation"
};

describe("validation error", () => {
  it("should be able to handle undefined errors", () => {
    const error: ValidationError = ValidationError.from({});
    expect(error.invalidParams).toStrictEqual([]);
  });

  it("should be able to convert invalidParams back to its original format", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );
    expect(error.invalidParams).toStrictEqual(validationSample.invalidParams);
  });

  it("should not serialize message when converting to json", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );
    expect(JSON.parse(JSON.stringify(error))).not.toContain("message");
  });

  it("should not be able to modify invalidParams or message", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );

    const propertyDescriptors = Object.getOwnPropertyDescriptors(error);
    expect(propertyDescriptors.invalidParams.writable).toStrictEqual(false);
    expect(propertyDescriptors.message.writable).toStrictEqual(false);
  });
});

describe("ValidationError.from ValidateJS", () => {
  it("should create a new validation error from validate js error outputs", () => {
    const error: ValidationError = ValidationError.from({ validateJsErrors: { error: [ "reason" ] } });
    expect(error.message).toBe("");
    expect(error.status).toBe(400);
    expect(error.type).toBe(ApiErrorType.validation);
    expect(error.invalidParams).toStrictEqual(validationSample.invalidParams);
  });
});

describe("Validation.from InvalidParams", () => {
  it("should create a new validation error from invalid params", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );
    expect(error.message).toBe("");
    expect(error.status).toBe(400);
    expect(error.type).toBe(ApiErrorType.validation);
    expect(error.invalidParams).toStrictEqual(validationSample.invalidParams);
  });
});
