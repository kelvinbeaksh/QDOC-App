import BusinessError from "../../src/errors/business-error";
import { ApiErrorType } from "../../src/errors/error-response";

describe("business error", () => {
  it("should create a new business error", () => {
    const error: BusinessError = new BusinessError("Message", "TEST-001");
    expect(error.message).toBe("Message");
    expect(error.code).toBe("TEST-001");
    expect(error.type).toBe(ApiErrorType.business);
  });

  it("should not be able to modify code", () => {
    const error: BusinessError = new BusinessError("Message", "TEST-001");

    const propertyDescriptors = Object.getOwnPropertyDescriptors(error);
    const isInvalidParamsWriteable = propertyDescriptors.code.writable;
    expect(isInvalidParamsWriteable).toStrictEqual(false);
  });
});
