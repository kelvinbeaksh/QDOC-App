import { blue, orange, red } from "@ant-design/colors";
import { Ticket, TicketStatus } from "../types/ticket";

export const getPatientsAhead = (ticket: Ticket): number => {
  const queue = ticket.queue.pendingTicketIdsOrder;
  const patientAhead = queue.indexOf(ticket.id);
  return patientAhead > 0 ? patientAhead : 0;
};

const getTicketWaitingStatus = (ticket: Ticket): TicketWaitingStatus => {
  if (ticket.status === TicketStatus.CLOSED) return TicketWaitingStatus.CLOSED;
  if (ticket.status === TicketStatus.SERVING) return TicketWaitingStatus.SERVING;
  return getPatientsAhead(ticket) > 3 ? TicketWaitingStatus.WAITING : TicketWaitingStatus.REACHING;
};

export const getBackgroundColor = (ticket: Ticket): string => {
  const ticketWaitingStatus = getTicketWaitingStatus(ticket);
  switch (ticketWaitingStatus) {
    case TicketWaitingStatus.CLOSED: return blue[0];
    case TicketWaitingStatus.SERVING: return red[0];
    case TicketWaitingStatus.REACHING: return orange[1];
    default: return "white";
  }
};

export const getTicketInstructions = (ticket: Ticket): string => {
  const ticketWaitingStatus = getTicketWaitingStatus(ticket);
  switch (ticketWaitingStatus) {
    case TicketWaitingStatus.SERVING: return "Please head to the doctor's room now.";
    case TicketWaitingStatus.REACHING: return "Please be at the waiting area when your number is called.";
    default: return "";
  }
};

enum TicketWaitingStatus {
  WAITING = "WAITING",
  SERVING = "SERVING",
  REACHING = "REACHING",
  CLOSED = "CLOSED"
}
