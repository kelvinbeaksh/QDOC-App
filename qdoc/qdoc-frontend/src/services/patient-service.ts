import { apiClient } from "../clients/api-client";
import { GenericErrorWrapper } from "../utils/error-handlers";
import { Patient } from "../types/patient";

class PatientService {
  @GenericErrorWrapper()
  public static async getPatientById(patientId: number): Promise<Patient> {
    const result = (await apiClient.get<Patient>(`/patients/${patientId}`));
    return result.data;
  }
}

export default PatientService;
