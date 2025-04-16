import { passwordRegex } from "../../src/utils/form-utils";

describe("password regex", () => {
  it("should return true when it has numbers, uppercase and lowercase alphabets and special chars", () => {
    expect(passwordRegex.test("123Abc!@#")).toBeTruthy();
  });

  it("should return false when it is only numbers", () => {
    expect(passwordRegex.test("123123")).toBeFalsy();
  });

  it("should return false when it is only alphabets", () => {
    expect(passwordRegex.test("abcd")).toBeFalsy();
  });

  it("should return false when it is only special characters", () => {
    expect(passwordRegex.test("@+.!")).toBeFalsy();
  });

  it("should return false when it is only numbers and special characters", () => {
    expect(passwordRegex.test("123123@+.!")).toBeFalsy();
  });

  it("should return false when it is only alphabets and special characters", () => {
    expect(passwordRegex.test("abcd@+.!")).toBeFalsy();
  });
});
