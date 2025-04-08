import { apiClient } from "../clients/api-client";
import { GenericErrorWrapper } from "../utils/error-handlers";
import { Ticket, TicketStatus, TicketType } from "../types/ticket";

interface CreateTicketRequest {
  patientId: number
  queueId: number
  clinicId: number,
  type: TicketType,
}

interface FetchTicketsRequest {
  patientId?: number
  queueId?: number
  clinicId?: number
  status?: TicketStatus[]
}

interface UpdateTicketAttributes {
  status: TicketStatus
}

class TicketService {
  @GenericErrorWrapper()
  public static async createTicket(patientId: number,
    queueId: number,
    clinicId: number,
    type: TicketType): Promise<Ticket> {
    const createTicketRequest: CreateTicketRequest = { patientId, queueId, clinicId, type };
    const response = await apiClient.post<Ticket, CreateTicketRequest>("/tickets", createTicketRequest);
    return response.data;
  }

  @GenericErrorWrapper()
  public static async getAllTickets(fetchTicketsRequest?: FetchTicketsRequest): Promise<Ticket[]> {
    if (fetchTicketsRequest) {
      const response = await apiClient.get<Ticket[]>("/tickets", {
        ...fetchTicketsRequest
      });
      return response.data;
    }
    const response = await apiClient.get<Ticket[]>("/tickets");
    return response.data;
  }

  @GenericErrorWrapper()
  public static async getTicket(ticketId: number): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`/tickets/${ticketId}`);
    return response.data;
  }

  @GenericErrorWrapper()
  public static async update(ticketId: number, updateTicketAttributes: UpdateTicketAttributes): Promise<void> {
    await apiClient.put<void, UpdateTicketAttributes>(`/tickets/${ticketId}`, updateTicketAttributes);
  }
}

export default TicketService;
