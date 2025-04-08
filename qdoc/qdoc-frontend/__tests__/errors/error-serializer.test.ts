import TechnicalError from "../../src/errors/technical-error";
import { deserializeError } from "../../src/errors/error-serializer";
import { ApiErrorResponse } from "../../src/errors/error-response";
import BusinessError from "../../src/errors/business-error";

describe("Error Serializer", () => {
  const testErrorJSONs = [
    {
      class: BusinessError,
      sample: {
        id: "2020-9218-1210",
        type: "business",
        code: "PPH-TEST-001",
        message: "Business Message"
      }
    },
    {
      class: TechnicalError,
      sample: {
        id: "3729-5983-1131",
        type: "technical",
        message: "Technical Message"
      }
    }
  ];
  describe("deserialize into the correct type", () => {
    for (const testJSONType of testErrorJSONs) {
      it(`should return a ${testJSONType.class.name} with all attributes`, () => {
        const createdObject = deserializeError(testJSONType.sample as ApiErrorResponse);

        expect(createdObject).toBeInstanceOf(testJSONType.class);
        expect({ ...createdObject }).toStrictEqual({
          ...testJSONType.sample
        });
      });
    }
  });
});
