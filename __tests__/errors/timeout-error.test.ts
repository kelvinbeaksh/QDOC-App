import TimeoutError from "../../src/errors/timeout-error";

describe("TimeoutError", () => {
  it("should create timeout error with default message", () => {
    const timeoutError = new TimeoutError();

    expect(timeoutError.message).toEqual("Timeout Error");
    expect(timeoutError.id).toEqual("-1");
  });

  it("should create timeout error with given parameters", () => {
    const expectedMessage = "Timeout....";
    const expectedId = "12345";
    const timeoutError = new TimeoutError(expectedMessage, expectedId);

    expect(timeoutError.message).toEqual(expectedMessage);
    expect(timeoutError.id).toEqual(expectedId);
  });
});
