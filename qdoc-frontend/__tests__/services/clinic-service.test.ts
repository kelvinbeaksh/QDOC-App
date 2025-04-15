import ClinicService from "../../src/services/clinic-service";
import { apiClient } from "../../src/clients/api-client";
import { Clinic } from "../../src/types/clinic";
import TechnicalError from "../../src/errors/technical-error";

describe("ClinicService", () => {
  describe("#getAllClinics", () => {
    let expectedClinics: Clinic[];

    it("should fetch all clinics", async () => {
      expectedClinics = [ {
        id: 1,
        address: "address",
        name: "clinic name 1",
        postalCode: "012345",
        email: "email@address",
        phoneNumber: "650123445",
        lat: 1.123,
        long: 100.2,
        queues: []
      } ];
      const expectedResponse = { data: expectedClinics };
      jest.spyOn(apiClient, "get").mockResolvedValueOnce(expectedResponse);
      const actualClinics = await ClinicService.getAllClinics();
      expect(actualClinics).toEqual(expectedClinics);
    });

    it("should return an empty array if there is no clinics", async () => {
      expectedClinics = [];
      const expectedResponse = {
        data: expectedClinics
      };
      jest.spyOn(apiClient, "get").mockResolvedValueOnce(expectedResponse);
      const actualClinics = await ClinicService.getAllClinics();
      expect(actualClinics).toEqual(expectedClinics);
    });

    it("should make call to get /clinics", () => {
      const spy = jest.spyOn(apiClient, "get").mockResolvedValueOnce({ data: [] });
      ClinicService.getAllClinics();
      expect(spy).toHaveBeenCalledWith("/clinics");
    });

    it("should return an error when apiClient errors", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "get").mockRejectedValue(expectedError);
      await expect(ClinicService.getAllClinics()).rejects.toThrow(new TechnicalError("error"));
    });
  });
});
