import DoctorService from "../../src/services/doctor-service";
import { apiClient } from "../../src/clients/api-client";

describe("DoctorService", () => {
  describe("getDoctorById", () => {
    it("should call apiClient with the expected path", async () => {
      const spy = jest.spyOn(apiClient, "get").mockResolvedValue({});
      await DoctorService.getDoctorById(1);
      expect(spy).toBeCalledWith("/doctors/1");
    });
  });

  describe("findDoctors", () => {
    describe("when there is findAllDoctorAttrs passed down", () => {
      it("should call apiClient with the expected params", async () => {
        const spy = jest.spyOn(apiClient, "get").mockResolvedValue({});
        const findAllDoctorsAttributes = { clinicId: 1, onDuty: true };
        await DoctorService.findDoctors(findAllDoctorsAttributes);
        expect(spy).toBeCalledWith("/doctors", findAllDoctorsAttributes);
      });
    });

    describe("when there is no findAllDoctorAttrs passed down", () => {
      it("should call apiClient with the expected params", async () => {
        const spy = jest.spyOn(apiClient, "get").mockResolvedValue({});
        await DoctorService.findDoctors();
        expect(spy).toBeCalledWith("/doctors");
      });
    });
  });
});
