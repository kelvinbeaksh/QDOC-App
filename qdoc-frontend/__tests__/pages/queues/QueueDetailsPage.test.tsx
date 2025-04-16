import { act, render } from "@testing-library/react";
import React from "react";
import { HashRouter } from "react-router-dom";
import QueueDetailsPage from "../../../src/pages/queues/QueueDetailsPage";
import QueueService from "../../../src/services/queue-service";
import { Queue, QueueStatus } from "../../../src/types/queue";
import TicketService from "../../../src/services/ticket-service";

const CLINIC_ID = 222;
const QUEUE_ID = 112;
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    queueId: QUEUE_ID
  }),
  useRouteMatch: () => ({ url: `/clinics/${CLINIC_ID}/queues/${QUEUE_ID}`, path: "/clinics/:clinicId/queues/:queueId" })
}));

const exampleQueue = {
  id: QUEUE_ID,
  clinicId: CLINIC_ID,
  status: QueueStatus.INACTIVE,
  startedAt: "2021-05-29T12:08:07.485Z",
  closedAt: "2021-05-29T12:08:09.901Z",
  currentTicketId: null,
  currentTicket: null,
  pendingTicketIdsOrder: [],
  tickets: [],
  latestGeneratedTicketDisplayNumber: 0,
  createdAt: "2021-05-27T14:13:18.916Z",
  updatedAt: "2021-05-28T12:08:09.906Z",
  clinic: {
    id: CLINIC_ID
  }
} as unknown as Queue;

describe("QueueDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(QueueService, "getQueueByQueueId").mockResolvedValue(exampleQueue);
    jest.spyOn(TicketService, "getAllTickets").mockResolvedValue([]);
  });

  const renderApp = async (): Promise<void> => {
    await act(async () => {
      render(
        <HashRouter>
          <QueueDetailsPage />
        </HashRouter>
      );
    });
  };

  it("should call queue service to get queue details", async () => {
    await renderApp();
    expect(QueueService.getQueueByQueueId).toHaveBeenCalledTimes(1);
    expect(QueueService.getQueueByQueueId).toHaveBeenCalledWith(QUEUE_ID);
  });
});
