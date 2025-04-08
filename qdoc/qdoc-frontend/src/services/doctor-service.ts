import { apiClient } from "../clients/api-client";
import { GenericErrorWrapper } from "../utils/error-handlers";
import { Doctor } from "../types/doctor";

export interface FindAllDoctorAttributes {
  clinicId? :number,
  onDuty?: boolean,
  queueId?: number
}

class DoctorService {
  @GenericErrorWrapper()
  public static async getDoctorById(doctorId: number): Promise<Doctor> {
    const result = (await apiClient.get<Doctor>(`/doctors/${doctorId}`));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async findDoctors(findAllDoctorsAttributes?: FindAllDoctorAttributes): Promise<Doctor[]> {
    if (findAllDoctorsAttributes) {
      const result = (await apiClient.get<Doctor[]>("/doctors", { ...findAllDoctorsAttributes }));
      return result.data;
    }
    const result = (await apiClient.get<Doctor[]>("/doctors"));
    return result.data;
  }
}

export default DoctorService;
