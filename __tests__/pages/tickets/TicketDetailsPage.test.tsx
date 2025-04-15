import { act, render, screen } from "@testing-library/react";
import React from "react";
import { HashRouter } from "react-router-dom";
import TicketDetailsPage from "../../../src/pages/tickets/TicketDetailsPage";
import TicketService from "../../../src/services/ticket-service";
import { Ticket, TicketStatus, TicketType } from "../../../src/types/ticket";
import moment from "moment";
import { Queue } from "../../../src/types/queue";
import { Clinic } from "../../../src/types/clinic";
import { Doctor } from "../../../src/types/doctor";

const mockUseLocation = jest.fn();
const TICKET_ID = 1;
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    ticketId: TICKET_ID
  }),
  useLocation: () => mockUseLocation,
  useRouteMatch: () => ({ url: `/tickets/${TICKET_ID}`, path: "/tickets/:ticketId" })
}));

describe("TicketDetailsPage", () => {
  const renderApp = async (): Promise<void> => {
    await act(async () => {
      render(
        <HashRouter>
          <TicketDetailsPage userId={1}/>
        </HashRouter>
      );
    });
  };

  describe("when the ticket is of type physical", () => {
    const ticket = {
      id: TICKET_ID,
      clinicId: 123,
      queueId: 245,
      displayNumber: 389,
      type: TicketType.PHYSICAL,
      status: TicketStatus.CLOSED,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      queue: {
        id: 1,
        pendingTicketIdsOrder: [ 2 ],
        doctor: { id: 1, firstName: "first", lastName: "last" } as Doctor
      } as Queue,
      clinic: {
        name: "singapura clinic"
      } as unknown as Clinic
    } as Ticket;
    beforeEach(() => {
      jest.spyOn(TicketService, "getTicket").mockResolvedValue(ticket);
    });

    it("should call ticket service to getTicket", async () => {
      await renderApp();
      expect(TicketService.getTicket).toHaveBeenCalledWith(1);
    });

    it("should call useLocation", async () => {
      await renderApp();
      expect(mockUseLocation).not.toHaveBeenCalled();
    });
  });

  describe("when the ticket is of type telemed and type serving", () => {
    const ticket = {
      id: TICKET_ID,
      clinicId: 123,
      queueId: 245,
      displayNumber: 389,
      patientId: 1,
      type: TicketType.TELEMED,
      status: TicketStatus.SERVING,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      queue: {
        id: 1,
        pendingTicketIdsOrder: [ 2 ],
        doctor: { id: 1, firstName: "first", lastName: "last" } as Doctor
      } as Queue,
      clinic: {
        name: "singapura clinic"
      } as unknown as Clinic
    } as Ticket;

    beforeEach(() => {
      jest.spyOn(TicketService, "getTicket").mockResolvedValue(ticket);
    });

    it("should show the join call with doctor link", async () => {
      await renderApp();
      const link = screen.getByRole("link", { name: /join call with doctor/i });
      expect(link).toBeInTheDocument();
    });
  });
});
