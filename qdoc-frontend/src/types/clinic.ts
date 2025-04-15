// eslint-disable-next-line import/no-cycle
import { Queue } from "./queue";

export type Clinic = {
  id: number;
  name: string;
  imageUrl?: string,
  address: string,
  lat: number,
  long: number,
  postalCode: string,
  email: string,
  phoneNumber: string
  queues?: Queue[]
};
