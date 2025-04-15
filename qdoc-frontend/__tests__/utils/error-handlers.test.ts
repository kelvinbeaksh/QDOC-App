import { notification } from "antd";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import { ApiErrorType } from "../../src/errors/error-response";
import ValidationError from "../../src/errors/validation-error";
import { GenericErrorWrapper } from "../../src/utils/error-handlers";
import TimeoutError from "../../src/errors/timeout-error";

describe("error handler", () => {
  describe("Generic error handler", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const businessError = new BusinessError("(business error", "error code");
    const technicalError: TechnicalError = {
      id: "fake-id",
      message: "Token session is not active",
      type: ApiErrorType.technical,
      status: 500,
      name: ""
    };

    const validationSample = {
      id: "fake-uuid",
      invalidParams: [ { name: "error", reason: "reason" } ],
      type: "validation"
    };
    const validationError: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );

    class SomeService {
      @GenericErrorWrapper()
      public async someMethod(): Promise<never> {
        throw businessError;
      }

      @GenericErrorWrapper()
      public async otherMethod(): Promise<never> {
        throw validationError;
      }

      @GenericErrorWrapper()
      public async timeOutMethod(): Promise<never> {
        throw new TimeoutError();
      }

      @GenericErrorWrapper()
      public async technicalMethod(): Promise<never> {
        throw technicalError;
      }
    }

    it("should show error notification box and throw validation error", async () => {
      const spy = jest.fn();
      const service = new SomeService();
      notification.error = spy;

      await expect(service.otherMethod()).rejects.toEqual(validationError);
      expect(spy).toBeCalledWith({
        description: "reason",
        message: "A validation error occurred",
        placement: "topRight",
        top: 130,
        style: { maxHeight: "80vh", overflowY: "auto", whiteSpace: "pre-line" }
      });
    });

    it("should not show error notification box for timeout error", async () => {
      const service = new SomeService();
      notification.error = jest.fn();

      const timeoutError: TimeoutError = new TimeoutError();

      await expect(service.timeOutMethod()).rejects.toEqual(timeoutError);
      expect(notification.error).not.toBeCalled();
    });

    it("should show technical error notification box and call timeout for 'Token session is not active'",
      async () => {
        jest.useFakeTimers();
        const service = new SomeService();
        notification.error = jest.fn();

        await expect(service.technicalMethod()).rejects.toEqual(technicalError);

        expect(notification.error).toBeCalledWith({
          description: "Your session has expired. You will be redirected to the login page.",
          message: "A technical error occurred",
          placement: "topRight",
          top: 130,
          style: { maxHeight: "80vh", overflowY: "auto", whiteSpace: "pre-line" }
        });
      });
  });
});
