import React from "react";
import { render, screen } from "@testing-library/react";
import ClinicDetailsCard from "../../src/components/ClinicDetailsCard";
import { Clinic } from "../../src/types/clinic";
import { Queue, QueueStatus } from "../../src/types/queue";
import { MemoryRouter } from "react-router";
import { UserRoles } from "../../src/clients/auth-client";
import { UserContext } from "../../src/contexts/user-context";

describe("ClinicDetailsCard", () => {
  const clinic = {
    id: 1,
    name: "clinic name",
    address: "clinic address",
    postalCode: "012345"
  } as Clinic;

  const queue = {
    id: 1,
    clinicId: clinic.id,
    status: QueueStatus.ACTIVE,
    tickets: [],
    pendingTicketIdsOrder: [],
    latestGeneratedTicketDisplayNumber: 1
  } as unknown as Queue;

  it("should render ClinicInfo", () => {
    render(
      <MemoryRouter>
        <ClinicDetailsCard clinic={clinic} queue={queue} />
      </MemoryRouter>
    );
    expect(screen.getByText(clinic.name)).toBeInTheDocument();
    expect(screen.getByText(clinic.address)).toBeInTheDocument();
  });

  describe("when the user is a DOCTOR", () => {
    it("should show the manage queue button", () => {
      render(

        <MemoryRouter>
          <UserContext.Provider value={{ user: { email: "doc@gmail.com",
            role: UserRoles.DOCTOR },
          isAuthenticated: true }}>
            <ClinicDetailsCard clinic={clinic} queue={queue} />
          </UserContext.Provider>
ø        </MemoryRouter>

      );
      expect(screen.getByRole("button", { name: /manage queue/i })).toBeInTheDocument();
    });
  });
});
