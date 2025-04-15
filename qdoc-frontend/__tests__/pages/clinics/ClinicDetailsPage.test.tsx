import { act, render, screen } from "@testing-library/react";
import { Route } from "react-router-dom";
import React from "react";
import ClinicDetailsPage from "../../../src/pages/clinics/ClinicDetailsPage";
import { MemoryRouter } from "react-router";
import ClinicService from "../../../src/services/clinic-service";
import { Clinic } from "../../../src/types/clinic";
import QueueService from "../../../src/services/queue-service";
import { Queue } from "../../../src/types/queue";

describe("ClinicDetailsPage", () => {
  const clinicId = 1;
  const renderApp = async (): Promise<void> => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[ `clinics/${clinicId}` ]}>
          <Route path='clinics/:clinicId'>
            <ClinicDetailsPage/>
          </Route>
        </MemoryRouter>
      );
    });
  };

  beforeEach(() => {
    jest.spyOn(ClinicService, "getClinicById").mockResolvedValue(
      {
        id: clinicId,
        name: "Clinic 1 Name",
        address: "Clinic 1 Address",
        postalCode: "012345"
      } as Clinic
    );
    jest.spyOn(QueueService, "getQueuesByClinicIdAndStatus").mockResolvedValue(
      [ {
        id: 1,
        pendingTicketIdsOrder: [],
        clinicId
      } as Queue ]
    );
  });
  it("should render clinic details", async () => {
    await renderApp();
    expect(screen.getByText("Clinic 1 Name")).toBeInTheDocument();
    expect(screen.getByText("Clinic 1 Address")).toBeInTheDocument();
  });
});
