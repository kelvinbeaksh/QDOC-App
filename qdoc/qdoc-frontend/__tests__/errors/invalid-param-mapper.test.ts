import { invalidParamMapper } from "../../src/errors/invalid-param-mapper";
import { InvalidParam } from "../../src/errors/error-response";

describe("Invalid Param Mapper", () => {
  describe("from validateJS", () => {
    it("should map ValidateJS to invalidParams", () => {
      const validateJSErrors = { error: [ "reason" ] };
      const invalidParams = [ { name: "error", reason: "reason" } ];

      expect(invalidParamMapper.fromValidateJSError(validateJSErrors)).toStrictEqual(invalidParams);
    });

    it("should map an empty value to invalidParams with empty values", () => {
      const validateJSErrors = { nric: undefined, mobileNumber: [ "Invalid" ] };
      const invalidParams: InvalidParam[] = [ { name: "mobileNumber", reason: "Invalid" } ];

      expect(invalidParamMapper.fromValidateJSError(validateJSErrors)).toStrictEqual(invalidParams);
    });
  });

  describe("to invalidParams", () => {
    it("should map invalidParams to empty values", () => {
      const invalidParams = [ { name: "error", reason: "reason" } ];
      const validateJSErrors = { error: [ "reason" ] };

      expect(invalidParamMapper.toValidateJSError(invalidParams)).toStrictEqual(validateJSErrors);
    });
    it("should merge multiple invalidParams to ValidateJS", () => {
      const emptyInvalidParams: InvalidParam[] = [
        { name: "mobileNumber", reason: "Not starting with 8 or 9" },
        { name: "mobileNumber", reason: "Not 8 characters" }
      ];
      const emptyValidateJSErrors = {
        mobileNumber: [ "Not starting with 8 or 9", "Not 8 characters" ]
      };
      expect(invalidParamMapper.toValidateJSError(emptyInvalidParams)).toStrictEqual(emptyValidateJSErrors);
    });
  });
});
