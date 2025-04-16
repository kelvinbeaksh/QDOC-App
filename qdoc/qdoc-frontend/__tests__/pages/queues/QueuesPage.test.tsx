import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import QueuesPage from "../../../src/pages/queues/QueuesPage";
import QueueService from "../../../src/services/queue-service";
import { Queue, QueueStatus } from "../../../src/types/queue";
import { actWait } from "../../test-helpers/act-patch";
import DoctorService from "../../../src/services/doctor-service";
import { Doctor } from "../../../src/types/doctor";
import ClinicService from "../../../src/services/clinic-service";
import { Clinic } from "../../../src/types/clinic";

const CLINIC_ID = 111;
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    clinicId: CLINIC_ID
  }),
  useRouteMatch: () => ({ url: `/clinics/${CLINIC_ID}/queues`, path: "/clinics/:clinicId/queues" })
}));

describe("QueuesPage", () => {
  const doctor = { id: 1, firstName: "first", lastName: "last" } as Doctor;
  beforeEach(() => {
    jest.spyOn(DoctorService, "findDoctors").mockResolvedValue([ doctor ]);
    jest.spyOn(ClinicService, "getClinicById").mockResolvedValue({ id: 1, name: "name" } as Clinic);
  });
  it("should call queue service to get list of queues associated with the clinic", async () => {
    jest.spyOn(QueueService, "getQueuesForClinic").mockResolvedValue([ ]);
    await act(async () => {
      render(
        <MemoryRouter>
          <QueuesPage />
        </MemoryRouter>
      );
    });
    expect(QueueService.getQueuesForClinic).toHaveBeenCalledTimes(1);
    expect(QueueService.getQueuesForClinic).toHaveBeenCalledWith(CLINIC_ID);
  });

  it("should display Queues table with correct columns", async () => {
    jest.spyOn(QueueService, "getQueuesForClinic").mockResolvedValue([ ]);
    const component = render(
      <MemoryRouter>
        <QueuesPage />
      </MemoryRouter>
    );
    await actWait();
    expect(component.getByRole("table")).toBeInTheDocument();
    expect(component.getByText("Id")).toBeInTheDocument();
    expect(component.getByText("Created At")).toBeInTheDocument();
    expect(component.getByText("Status")).toBeInTheDocument();
    expect(component.getByText("Started At")).toBeInTheDocument();
    expect(component.getByText("Closed At")).toBeInTheDocument();
  });

  it("should be able to update queue status for each queue", async () => {
    const queueId = 11;
    jest.spyOn(QueueService, "getQueuesForClinic").mockResolvedValue([ {
      id: queueId,
      clinicId: CLINIC_ID,
      status: QueueStatus.INACTIVE
    } as Queue ]);
    jest.spyOn(QueueService, "update").mockResolvedValue({} as Queue);
    const component = render(
      <MemoryRouter>
        <QueuesPage />
      </MemoryRouter>
    );
    await actWait();
  });

  it("should call clinic service to get clinic info", async () => {
    jest.spyOn(QueueService, "getQueuesForClinic").mockResolvedValue([ ]);
    const spy = jest.spyOn(ClinicService, "getClinicById").mockResolvedValue({ id: 1, name: "name" } as Clinic);
    await act(async () => {
      render(
        <MemoryRouter>
          <QueuesPage />
        </MemoryRouter>
      );
    });
    expect(spy).toHaveBeenCalled();
  });
});
