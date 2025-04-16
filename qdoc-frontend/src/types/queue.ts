/* eslint-disable import/no-cycle */
import { Ticket } from "./ticket";
import { Clinic } from "./clinic";
import { Doctor } from "./doctor";

export interface Queue {
  id: number;
  clinicId: number;
  status: QueueStatus;
  startedAt: string;
  closedAt: string;
  currentTicketId: number | null,
  currentTicket: Ticket | null,
  pendingTicketIdsOrder: number[];
  createdAt: string;
  updatedAt: string;
  clinic?: Clinic,
  doctor: Doctor
}

export enum QueueStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CLOSED = "CLOSED"
}

export type QueueTable = {
  id: number;
  status: string;
  createdAt: string;
  startedAt: string;
  closedAt: string;
};

export const getTelemedCallLink = (queue: Queue): string => {
  return `/telemed/${queue.clinic.name.toLowerCase().replace(/ /g, "-")}-dr-${queue.doctor.lastName.toLowerCase()}`;
};
