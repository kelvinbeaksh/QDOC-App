import { apiClient } from "../../src/clients/api-client";
import PatientService from "../../src/services/patient-service";

describe("PatientService", () => {
  describe("getPatientById", () => {
    it("should call apiClient with the expected path", async () => {
      const spy = jest.spyOn(apiClient, "get").mockResolvedValue({});
      await PatientService.getPatientById(1);
      expect(spy).toBeCalledWith("/patients/1");
    });
  });
});
