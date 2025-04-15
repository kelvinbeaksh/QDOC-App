import React from "react";
import { render, screen } from "@testing-library/react";
import { Queue, QueueStatus } from "../../src/types/queue";
import { MemoryRouter } from "react-router";
import { User } from "../../src/contexts/user-context";
import { UserRoles } from "../../src/clients/auth-client";
import ClinicDetails from "../../src/components/ClinicDetails";
import TicketService from "../../src/services/ticket-service";

describe("ClinicDetails", () => {
  const user = {
    email: "user@gmail.com",
    authId: "authId",
    role: UserRoles.PATIENT,
    patientId: 1
  } as unknown as User;

  const queue = {
    id: 1,
    clinicId: 1,
    status: QueueStatus.ACTIVE,
    tickets: [],
    pendingTicketIdsOrder: [ 2 ],
    latestGeneratedTicketDisplayNumber: 1
  } as unknown as Queue;

  beforeEach(() => {
    jest.spyOn(TicketService, "getAllTickets").mockResolvedValue([]);
  });

  it("should render Clinic Queue Details", () => {
    render(
      <MemoryRouter>
        <ClinicDetails queue={queue} user={user}/>
      </MemoryRouter>
    );
    expect(screen.getByText("No. of patients in queue: 1")).toBeInTheDocument();
    expect(screen.getByText("Estimated waiting time: 8 mins")).toBeInTheDocument();
  });
});
