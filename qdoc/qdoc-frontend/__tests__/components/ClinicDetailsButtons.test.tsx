import React from "react";
import { render, screen } from "@testing-library/react";
import { Queue, QueueStatus } from "../../src/types/queue";
import { MemoryRouter } from "react-router";
import { User } from "../../src/contexts/user-context";
import { UserRoles } from "../../src/clients/auth-client";
import TicketService from "../../src/services/ticket-service";
import userEvent from "@testing-library/user-event";
import { Ticket, TicketType } from "../../src/types/ticket";
import ClinicDetailsButtons from "../../src/components/ClinicDetailsButtons";

describe("ClinicDetailsButtons", () => {
  const queue = {
    id: 1,
    clinicId: 1,
    status: QueueStatus.ACTIVE,
    tickets: [],
    pendingTicketIdsOrder: [ 2 ],
    latestGeneratedTicketDisplayNumber: 1
  } as unknown as Queue;

  beforeEach(jest.resetAllMocks);

  describe("when the user is a patient", () => {
    const user = { patientId: 1, role: UserRoles.PATIENT } as User;
    beforeEach(() => {
      jest.spyOn(TicketService, "getAllTickets").mockResolvedValue([]);
    });

    describe.skip("and the user clicks on join queue", () => {
      it("should call TicketService to create a Physical Ticket", () => {
        render(
          <MemoryRouter>
            <ClinicDetailsButtons user={user} queue={queue} />
          </MemoryRouter>
        );
        const spy = jest.spyOn(TicketService, "createTicket").mockResolvedValue({} as Ticket);
        const button = screen.getByRole("button", { name: /join queue/i });
        userEvent.click(button);
        expect(spy).toBeCalledWith(1, 1, 1, TicketType.PHYSICAL);
      });
    });

    describe("and the user clicks on tele-consult", () => {
      it("should call TicketService to create a Telemed ticket", () => {
        render(
          <MemoryRouter>
            <ClinicDetailsButtons user={user} queue={queue} />
          </MemoryRouter>
        );
        const spy = jest.spyOn(TicketService, "createTicket").mockResolvedValue({} as Ticket);
        const button = screen.getByRole("button", { name: /Tele-consult/i });
        userEvent.click(button);
        expect(spy).toBeCalledWith(1, 1, 1, TicketType.TELEMED);
      });
    });
  });
});
