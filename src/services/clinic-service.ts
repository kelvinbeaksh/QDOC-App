import { apiClient } from "../clients/api-client";
import { Clinic } from "../types/clinic";
import { GenericErrorWrapper } from "../utils/error-handlers";
class ClinicService {
  @GenericErrorWrapper()
  public static async getAllClinics(): Promise<Clinic[]> {
    const result = (await apiClient.get<Clinic[]>("/clinics"));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async getClinicById(clinicId: number): Promise<Clinic | null> {
    const result = (await apiClient.get<Clinic | null>(`/clinics/${clinicId}`));
    return result.data;
  }
}

export default ClinicService;
