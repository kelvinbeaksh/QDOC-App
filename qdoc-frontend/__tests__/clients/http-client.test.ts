import { mockAxiosInstance } from "../../__mocks__/axios";
import { HttpClient, validateStatus } from "../../src/clients/http-client";
import BusinessError from "../../src/errors/business-error";
import TimeoutError from "../../src/errors/timeout-error";
import TechnicalError from "../../src/errors/technical-error";

describe("API client", () => {
  describe("response status code range validation - [200, 500)", () => {
    it("should return true for response code within the range", () => {
      [ 200, 201, 202, 203 ].forEach(code => {
        expect(validateStatus(code)).toBeTruthy();
      });
    });

    it("should return false for response code out of range", () => {
      [ 400, 401, 503 ].forEach(code => {
        expect(validateStatus(code)).toBeFalsy();
      });
    });
  });

  describe("Http client", () => {
    let httpClient: HttpClient;
    const baseUrl = "apiBaseUrl";

    beforeEach(() => {
      httpClient = new HttpClient(baseUrl);
    });

    describe("get", () => {
      it("should return response data on success", async () => {
        mockAxiosInstance.get = jest.fn().mockResolvedValue({ status: 200, data: { foo: "bar" } });
        const response = await httpClient.get("", {});
        expect(response.data).toEqual({ foo: "bar" });
      });

      it("should reject response error on failure", async () => {
        const bizError = new BusinessError("BizError", "400");
        mockAxiosInstance.get = jest.fn().mockRejectedValue({ response: { status: 400, data: { ...bizError } } });
        await expect(httpClient.get("", {})).rejects.toStrictEqual(bizError);
      });

      it("should reject the promise with a Timeout error on request timeout", async () => {
        const axiosTimeoutError = {
          code: "ECONNABORTED",
          message: "timeout of 10000ms exceeded"
        };
        mockAxiosInstance.get = jest.fn().mockRejectedValue(axiosTimeoutError);
        await expect(httpClient.get("")).rejects.toEqual(new TimeoutError(axiosTimeoutError.message));
      });

      it("should reject the promise a Technical Error on unknown error", async () => {
        const unknownError = {};
        mockAxiosInstance.get = jest.fn().mockRejectedValue(unknownError);
        await expect(httpClient.get("")).rejects.toEqual(
          new TechnicalError("Unable to contact the server at this time. Please try again later")
        );
      });

      it("should have an axios instance present", async () => {
        expect(httpClient.axios).toBeTruthy();
      });
    });

    describe("post", () => {
      it("should perform return response data on success", async () => {
        mockAxiosInstance.post = jest.fn().mockResolvedValue({ status: 200, data: { foo: "bar" } });
        const response = await httpClient.post("", {});
        expect(response.data).toEqual({ foo: "bar" });
      });

      it("should perform reject response error on failure", async () => {
        const bizError = new BusinessError("BizError", "400");
        mockAxiosInstance.post = jest.fn().mockRejectedValue({ response: { status: 400, data: { ...bizError } } });
        await expect(httpClient.post("", {})).rejects.toStrictEqual(bizError);
      });

      it("should perform reject the promise with a Timeout error on request timeout", async () => {
        const axiosTimeoutError = {
          code: "ECONNABORTED",
          message: "timeout of 10000ms exceeded"
        };
        mockAxiosInstance.post = jest.fn().mockRejectedValue(axiosTimeoutError);
        await expect(httpClient.post("", {})).rejects.toEqual(new TimeoutError(axiosTimeoutError.message));
      });
    });

    describe("delete", () => {
      it("should call axios delete", async () => {
        mockAxiosInstance.delete = jest.fn().mockResolvedValueOnce({});
        const path = "surveys/1234";

        await httpClient.delete(path);

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith(path);
      });

      it("should perform reject response error on failure", async () => {
        const bizError = new BusinessError("BizError", "400");
        mockAxiosInstance.delete = jest.fn().mockRejectedValue({ response: { status: 400, data: { ...bizError } } });
        await expect(httpClient.delete("")).rejects.toStrictEqual(bizError);
      });

      it("should perform reject the promise with a Timeout error on request timeout", async () => {
        const axiosTimeoutError = {
          code: "ECONNABORTED",
          message: "timeout of 10000ms exceeded"
        };
        mockAxiosInstance.delete = jest.fn().mockRejectedValue(axiosTimeoutError);
        await expect(httpClient.delete("")).rejects.toEqual(new TimeoutError(axiosTimeoutError.message));
      });
    });

    describe("patch", () => {
      const path = "surveys/1234";
      const body = { someKey: "some value" };

      it("should call axios patch", async () => {
        mockAxiosInstance.patch = jest.fn().mockResolvedValueOnce({});

        await httpClient.patch(path, body);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith(path, body);
      });

      it("should perform reject response error on failure", async () => {
        const bizError = new BusinessError("BizError", "400");
        mockAxiosInstance.patch = jest.fn().mockRejectedValue({ response: { status: 400, data: { ...bizError } } });
        await expect(httpClient.patch(path, body)).rejects.toStrictEqual(bizError);
      });

      it("should perform reject the promise with a Timeout error on request timeout", async () => {
        const axiosTimeoutError = {
          code: "ECONNABORTED",
          message: "timeout of 10000ms exceeded"
        };
        mockAxiosInstance.patch = jest.fn().mockRejectedValue(axiosTimeoutError);
        await expect(httpClient.patch(path, body)).rejects.toEqual(new TimeoutError(axiosTimeoutError.message));
      });
    });
  });
});
