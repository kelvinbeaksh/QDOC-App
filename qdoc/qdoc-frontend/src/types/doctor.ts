// eslint-disable-next-line import/no-cycle
import { Clinic } from "./clinic";

export interface Doctor {
  id: number
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  onDuty: boolean
  dateOfBirth: string
  queueId: number
  clinicId: number,
  clinic: Clinic
}
