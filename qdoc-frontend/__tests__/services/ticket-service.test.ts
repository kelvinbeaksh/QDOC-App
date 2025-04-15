import { apiClient } from "../../src/clients/api-client";
import TechnicalError from "../../src/errors/technical-error";
import TicketService from "../../src/services/ticket-service";
import { TicketStatus, TicketType } from "../../src/types/ticket";

describe("TicketService", () => {
  describe("#createTicket", () => {
    const patientId = 333;
    const queueId = 333;
    const clinicId = 333;
    const type = TicketType.TELEMED;

    it("should make call to post /tickets with correct post body values", () => {
      const spy = jest.spyOn(apiClient, "post").mockResolvedValueOnce({});
      TicketService.createTicket(patientId, queueId, clinicId, type);

      expect(spy).toHaveBeenCalledWith("/tickets", { patientId, queueId, clinicId, type });
    });

    it("should return an error when apiClient throws error", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(apiClient, "post").mockRejectedValue(expectedError);

      await expect(TicketService.createTicket).rejects.toThrow(new TechnicalError("error"));
    });
  });

  describe("getAllTickets", () => {
    it("should call all tickets path with right queryParams", async () => {
      const spy = jest.spyOn(apiClient, "get").mockResolvedValueOnce({});
      await TicketService.getAllTickets({ patientId: 1, queueId: 2, clinicId: 1 });

      expect(spy).toHaveBeenCalledWith("/tickets", { patientId: 1,
        queueId: 2,
        clinicId: 1 });
    });

    it("should call all tickets path with no queryParams with there's no fetchTicketsRequest",
      async () => {
        const spy = jest.spyOn(apiClient, "get").mockResolvedValueOnce({});
        await TicketService.getAllTickets();

        expect(spy).toHaveBeenCalledWith("/tickets");
      });
  });

  describe("getTicket", () => {
    it("should call the right path", async () => {
      const ticketId = 1;
      const spy = jest.spyOn(apiClient, "get").mockResolvedValueOnce({});
      await TicketService.getTicket(ticketId);

      expect(spy).toHaveBeenCalledWith(`/tickets/${ticketId}`);
    });
  });

  describe("update", () => {
    it("should call the right path", async () => {
      const ticketId = 1;
      const spy = jest.spyOn(apiClient, "put").mockResolvedValueOnce({});
      await TicketService.update(ticketId, { status: TicketStatus.CLOSED });

      expect(spy).toHaveBeenCalledWith(`/tickets/${ticketId}`, { status: TicketStatus.CLOSED });
    });
  });
});
