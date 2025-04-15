import { apiClient } from "../../src/clients/api-client";
import MobileService from "../../src/services/mobile-service";

describe("MobileServiceTest", () => {
  describe("#sendVerificationToken", () => {
    it("should call apiClient with the expected params", async () => {
      const mobileNumber = "123";
      const spy = jest.spyOn(apiClient, "post").mockResolvedValue({});
      await MobileService.sendVerificationToken(mobileNumber);
      expect(spy).toBeCalledWith("/mobile/send-verification-token",
        { mobileNumber });
    });
  });

  describe("#checkVerificationToken", () => {
    it("should call apiClient with the expected params", async () => {
      const mobileNumber = "123";
      const token = "1234";
      const spy = jest.spyOn(apiClient, "post").mockResolvedValue({});
      await MobileService.checkVerificationToken(mobileNumber, token);
      expect(spy).toBeCalledWith("/mobile/verify-token",
        { mobileNumber, token });
    });
  });
});
