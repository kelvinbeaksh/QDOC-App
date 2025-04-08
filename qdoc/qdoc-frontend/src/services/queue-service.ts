/* eslint-disable no-console */
import { apiClient } from "../clients/api-client";
import { Queue, QueueStatus } from "../types/queue";
import { Doctor } from "../types/doctor";
import { Clinic } from "../types/clinic";
import { GenericErrorWrapper } from "../utils/error-handlers";
import TicketService from "./ticket-service";
import { Ticket, TicketStatus } from "../types/ticket";
import { authClient } from "../clients/auth-client";
import { number } from "yup";

export interface UpdateQueueRequest {
  clinicId: number
  status?: QueueStatus,
  currentTicketId?: number
}

interface QueueNextTicketRequest {
  doctorId: number
}

interface CloseTicketRequest {
  ticketId: number,
  queueId: number
}

interface CloseQueueRequest {
  queueId: number
}

interface CloseQueueResponse {
  id: number,
  clinicId: number,
  status: string,
  startedAt: string,
  closedAt: string,
  currentTicketId: number,
  pendingTicketIdsOrder: number[],
  latestGeneratedTicketDisplayNumber: number,
  doctorId: number,
  createdAt: string,
  updatedAt: string,
  currentTicket: Ticket,
  clinic: Clinic,
  doctor: Doctor
}

class QueueService {
  @GenericErrorWrapper()
  public static async getQueuesForClinic(clinicId: number): Promise<Queue[]> {
    const result = (await apiClient.get<Queue[]>("/queues", { clinicId }));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async createQueueForClinic(clinicId: number, doctorId: number): Promise<void> {
    const authToken = await authClient.getUserIdToken();
    await apiClient.post("/queues", { clinicId, doctorId }, { headers: {
      Authorization: authToken
    } });
  }

  @GenericErrorWrapper()
  public static async update(queueId: number, updateQueueRequest: UpdateQueueRequest): Promise<Queue> {
    const authToken = await authClient.getUserIdToken();
    const result = (await apiClient.put<Queue, UpdateQueueRequest>(
      `/queues/${queueId}`, updateQueueRequest, { headers: {
        Authorization: authToken
      } }
    ));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async closeQueue(queueId: number): Promise<Queue> {
    const authToken = await authClient.getUserIdToken();
    const result = await apiClient.put<Queue, CloseQueueRequest>(
      `/queues/${queueId}/close`, { queueId }, { headers: {
        Authorization: authToken
      } }
    );
    return result.data;
  }

  @GenericErrorWrapper()
  public static async closeTicket(queueId: number, ticketId: number): Promise<void> {
    const authToken = await authClient.getUserIdToken();
    await apiClient.put(`/queues/${queueId}/remove/${ticketId}`, { queueId, ticketId }, { headers: {
      Authorization: authToken
    } });
  }

  @GenericErrorWrapper()
  public static async getQueueByQueueId(queueId: number): Promise<Queue> {
    const result = (await apiClient.get<Queue>(`/queues/${queueId}`));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async getQueuesByClinicIdAndStatus(clinicId: number, status: QueueStatus): Promise<Queue[]> {
    const result = (await apiClient.get<Queue []>(`/queues?clinicId=${clinicId}&status=${status}`));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async nextTicket(doctorId: number, queueId: number): Promise<Queue> {
    const result = (await apiClient.post<Queue, QueueNextTicketRequest>(`/queues/${queueId}/next-ticket`,
      { doctorId }));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async closeCurrentTicket(queue: Queue): Promise<Queue> {
    await TicketService.update(
      queue.currentTicketId, { status: TicketStatus.CLOSED }
    );
    return QueueService.update(queue.id,
      { clinicId: queue.clinicId, currentTicketId: null });
  }

  @GenericErrorWrapper()
  public static async missCurrentTicket(queue: Queue): Promise<Queue> {
    await TicketService.update(
      queue.currentTicketId, { status: TicketStatus.MISSED }
    );
    return QueueService.update(queue.id,
      { clinicId: queue.clinicId, currentTicketId: null });
  }
}

export default QueueService;
