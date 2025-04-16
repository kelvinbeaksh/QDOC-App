import QueueService from "../../src/services/queue-service";
import { apiClient } from "../../src/clients/api-client";
import { Queue, QueueStatus } from "../../src/types/queue";
import TechnicalError from "../../src/errors/technical-error";
import TicketService from "../../src/services/ticket-service";
import { TicketStatus } from "../../src/types/ticket";
import { authClient } from "../../src/clients/auth-client";

describe("QueueService", () => {
  describe("#getQueuesForClinic", () => {
    let expectedQueues: Queue[];
    const clinicId = 1;

    it("should fetch all queues belonging to clinic", async () => {
      expectedQueues = [ {
        id: 1,
        clinicId,
        status: QueueStatus.ACTIVE
      } as Queue ];
      const expectedResponse = { data: expectedQueues };
      jest.spyOn(apiClient, "get").mockResolvedValueOnce(expectedResponse);

      const result = await QueueService.getQueuesForClinic(clinicId);

      expect(result).toEqual(expectedQueues);
    });

    it("should return an empty array if there is no queues for that clinic", async () => {
      expectedQueues = [];
      const expectedResponse = {
        data: expectedQueues
      };
      jest.spyOn(apiClient, "get").mockResolvedValueOnce(expectedResponse);
      const actualClinics = await QueueService.getQueuesForClinic(clinicId);
      expect(actualClinics).toEqual(expectedQueues);
    });

    it("should make call to get /queues with clinic in query params", () => {
      const spy = jest.spyOn(apiClient, "get").mockResolvedValueOnce({ data: [] });
      QueueService.getQueuesForClinic(clinicId);

      expect(spy).toHaveBeenCalledWith("/queues", { clinicId });
    });

    it("should return an error when apiClient throws error", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "get").mockRejectedValue(expectedError);

      await expect(QueueService.getQueuesForClinic).rejects.toThrow(new TechnicalError("error"));
    });
  });

  describe("#createQueueForClinic", () => {
    const clinicId = 2;
    const doctorId = 1;
    const authToken = "123";
    beforeEach(() => {
      jest.spyOn(authClient, "getUserIdToken").mockResolvedValue(authToken);
    });

    it("should make call to post /queues with clinicId in post body", async () => {
      const spy = jest.spyOn(apiClient, "post").mockResolvedValueOnce({});
      await QueueService.createQueueForClinic(clinicId, doctorId);

      expect(spy).toHaveBeenCalledWith("/queues", { clinicId, doctorId }, { headers: { "Authorization": authToken } });
    });

    it("should return an error when apiClient throws error", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "post").mockRejectedValue(expectedError);

      await expect(QueueService.createQueueForClinic).rejects.toThrow(new TechnicalError("error"));
    });
  });

  describe("#update", () => {
    const queueId = 3;
    const clinicId = 3;
    const authToken = "123";
    beforeEach(() => {
      jest.spyOn(authClient, "getUserIdToken").mockResolvedValue(authToken);
    });

    it("should make call to put /queues/:queueId with queue status in request body", async () => {
      const spy = jest.spyOn(apiClient, "put").mockResolvedValueOnce({ data: {} });
      await QueueService.update(queueId, { clinicId, status: QueueStatus.ACTIVE });
      expect(spy).toHaveBeenCalledWith(
        `/queues/${queueId}`, { clinicId, status: QueueStatus.ACTIVE }, { headers: { "Authorization": authToken } }
      );
    });

    it("should return an error when apiClient throws error", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "put").mockRejectedValue(expectedError);

      await expect(QueueService.update(queueId, { clinicId }))
        .rejects
        .toThrow(new TechnicalError("error"));
    });
  });

  describe("#getQueueByQueueId", () => {
    let expectedQueue: Queue;
    const queueId = 11;

    it("should fetch queue for queueId", async () => {
      expectedQueue = {
        id: queueId,
        clinicId: 11,
        status: QueueStatus.INACTIVE
      } as Queue;
      const expectedResponse = { data: expectedQueue };
      jest.spyOn(apiClient, "get").mockResolvedValueOnce(expectedResponse);

      const result = await QueueService.getQueueByQueueId(queueId);

      expect(result).toEqual(expectedQueue);
    });

    it("should make call to get /queues/:queueId", () => {
      const spy = jest.spyOn(apiClient, "get").mockResolvedValueOnce({ data: [] });
      QueueService.getQueueByQueueId(queueId);

      expect(spy).toHaveBeenCalledWith(`/queues/${queueId}`);
    });

    it("should return an error when apiClient throws error", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "get").mockRejectedValue(expectedError);

      await expect(QueueService.getQueueByQueueId).rejects.toThrow(new TechnicalError("error"));
    });
  });

  describe("#getQueuesByClinicIdAndStatus", () => {
    const clinicId = 1;

    it("should make call to get /queues?clinicId=clinicId&status=status", () => {
      const spy = jest.spyOn(apiClient, "get").mockResolvedValueOnce({ data: [] });
      QueueService.getQueuesByClinicIdAndStatus(clinicId, QueueStatus.ACTIVE);

      expect(spy).toHaveBeenCalledWith(`/queues?clinicId=${clinicId}&status=${QueueStatus.ACTIVE}`);
    });

    it("should fetch active queue for clinicId", async () => {
      const queueId = 11;
      const expectedQueue = {
        id: queueId,
        clinicId,
        status: QueueStatus.ACTIVE
      } as Queue;
      const expectedResponse = { data: [ expectedQueue ] };
      jest.spyOn(apiClient, "get").mockResolvedValueOnce(expectedResponse);

      const result = await QueueService.getQueuesByClinicIdAndStatus(clinicId, QueueStatus.ACTIVE);
      expect(result).toEqual([ expectedQueue ]);
    });

    it("should return an error when apiClient throws error", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "get").mockRejectedValue(expectedError);

      await expect(QueueService.getQueuesByClinicIdAndStatus).rejects.toThrow(new TechnicalError("error"));
    });
  });

  describe("nextTicket", () => {
    const queueId = 1;
    const clinicId = 1;
    const doctorId = 1;

    it("should make call to post /queues/:id/next-ticket", () => {
      const expectedQueue = {
        id: queueId,
        clinicId,
        status: QueueStatus.ACTIVE
      } as Queue;
      const spy = jest.spyOn(apiClient, "post").mockResolvedValueOnce({ data: expectedQueue });
      QueueService.nextTicket(doctorId, queueId);

      expect(spy).toHaveBeenCalledWith(`/queues/${queueId}/next-ticket`, { doctorId });
    });

    it("should return an error when apiClient throws error", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "post").mockRejectedValue(expectedError);

      await expect(QueueService.nextTicket).rejects.toThrow(new TechnicalError("error"));
    });
  });

  describe("closeCurrentTicket", () => {
    let ticketServiceSpy;
    let queueServiceSpy;

    beforeEach(() => {
      ticketServiceSpy = jest.spyOn(TicketService, "update")
        .mockResolvedValueOnce();
      queueServiceSpy = jest.spyOn(QueueService, "update")
        .mockResolvedValueOnce({} as Queue);
    });

    it("should call TicketService.updateTicket with the expected params", async () => {
      const queue = {
        id: 1,
        clinicId: 1,
        currentTicketId: 1
      } as Queue;
      await QueueService.closeCurrentTicket(queue);

      expect(ticketServiceSpy).toHaveBeenCalledWith(1, { status: TicketStatus.CLOSED });
    });

    it("should call QueueService.update with the expected params", async () => {
      const queue = {
        id: 1,
        clinicId: 1,
        currentTicketId: 1
      } as Queue;
      await QueueService.closeCurrentTicket(queue);

      expect(queueServiceSpy).toHaveBeenCalledWith(1, { clinicId: 1,
        currentTicketId: null });
    });
  });
});
