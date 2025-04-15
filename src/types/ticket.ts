/* eslint-disable import/no-cycle */
import { Queue } from "./queue";
import { Clinic } from "./clinic";
import { Patient } from "./patient";

export interface Ticket {
  id: number;
  displayNumber: number;
  patientId: number;
  status: TicketStatus;
  queueId: number;
  clinicId: number;
  createdAt: string;
  updatedAt: string;
  type: TicketType,
  zoomStartMeetingUrl?: string,
  zoomJoinMeetingUrl?: string,
  zoomMeetingId?: string,
  zoomMeetingPassword?: string,
  queue: Queue,
  clinic: Clinic,
  patient: Patient
}

export enum TicketStatus {
  WAITING = "WAITING",
  SERVING = "SERVING",
  CLOSED = "CLOSED",
  MISSED = "MISSED"
}

export enum TicketType {
  PHYSICAL = "PHYSICAL",
  TELEMED = "TELEMED"
}

export const getTelemedCallLink = (ticket: Ticket): string => {
  return `/telemed/${ticket.clinic.name.toLowerCase()
    .replace(/ /g, "-")}-dr-${ticket.queue.doctor.lastName.toLowerCase()}`;
};
