import { Queue, QueueStatus } from "../../types/queue";
import { Button, Card, Descriptions, Divider } from "antd";
import { formatDate } from "../../helpers/date-helpers";
import React, { ReactElement } from "react";
import Title from "antd/lib/typography/Title";
import QueueStatusTag from "./QueueStatusTag";
import queueCurrentlyServingButtons from "./queueCurrentlyServingButtons";
import { UserRoles } from "../../clients/auth-client";
import queueStatusButtons from "./QueueStatusButton";

function CurrentTicketDetails(props: { queue: Queue }): ReactElement {
  return (
    <Descriptions bordered column={{ xxl: 3, lg: 2, md: 2, sm: 1 }}>
      <Descriptions.Item label='Ticket Display Number'>
        {props.queue.currentTicket.displayNumber}
      </Descriptions.Item>
      <Descriptions.Item label='Ticket Type'>{props.queue.currentTicket.type}</Descriptions.Item>
      <Descriptions.Item label='Patient Id'>
        {props.queue.currentTicket.patientId}
      </Descriptions.Item>
      <Descriptions.Item label='Name'>
        {props.queue.currentTicket.patient.firstName} {props.queue.currentTicket.patient.lastName}
      </Descriptions.Item>
      <Descriptions.Item label='Date Of Birth'>
        {props.queue.currentTicket.patient.dateOfBirth}
      </Descriptions.Item>
      <Descriptions.Item label='Joined Queue At'>
        {formatDate(props.queue.currentTicket.createdAt)}
      </Descriptions.Item>
    </Descriptions>
  );
}

interface QueueDetailsCardProps {
  queue: Queue;
  updateQueue: (queueStatus: QueueStatus) => Promise<void>;
  closeQueue: () => Promise<void>;
  completeTicket: (queue: Queue) => Promise<void>;
  nextTicket: (queue: Queue) => Promise<void>;
  missTicket: (queue: Queue) => Promise<void>;
  userRole: UserRoles;
}

export const hasClinicManagementAccess = (userRoles: UserRoles): boolean => {
  return (
    userRoles === UserRoles.DOCTOR ||
    userRoles === UserRoles.CLINIC_STAFF ||
    userRoles === UserRoles.ADMIN
  );
};

const isQueueActiveAndHasPendingTickets = (queue: Queue): boolean => {
  return queue.status === QueueStatus.ACTIVE && queue.pendingTicketIdsOrder.length > 0;
};

const QueueDetailsCard = ({
  queue,
  updateQueue,
  closeQueue,
  completeTicket,
  nextTicket,
  missTicket,
  userRole
}: QueueDetailsCardProps): ReactElement => {
  return (
    <>
      <Card
        style={{ width: "100%" }}
        // className='with-shadow'
        title={
          <Title level={2} style={{ textAlign: "center" }}>
            {queue.clinic.name}
          </Title>
        }
        actions={hasClinicManagementAccess(userRole) && queueStatusButtons(queue, updateQueue, closeQueue)}
        extra={
          hasClinicManagementAccess(userRole) &&
        isQueueActiveAndHasPendingTickets(queue) && (
            <Button onClick={() => nextTicket(queue)}>Next Ticket</Button>
          )
        }
      >
        <Divider>
          <QueueStatusTag status={queue.status} className={"queue-status-tag"} />
        </Divider>
        <Descriptions bordered column={{ xxl: 3 }}>
          <Descriptions.Item label='Started At'>
            {queue.startedAt ? formatDate(queue.startedAt) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label='Number of Patients Pending'>
            {queue.pendingTicketIdsOrder.length}
          </Descriptions.Item>
          {queue.status === QueueStatus.CLOSED && (
            <Descriptions.Item label='Closed At'>
              {queue.closedAt ? formatDate(queue.closedAt) : "-"}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
      {queue.currentTicket && (
        <Card
          type='inner'
          className='with-shadow'
          title={<Title level={4}>Currently Serving</Title>}
          style={{ padding: "1rem", margin: "3rem" }}
          actions={queueCurrentlyServingButtons(queue, nextTicket, completeTicket, missTicket)}
        >
          <CurrentTicketDetails queue={queue} />
        </Card>
      )}
    </>
  );
};

export default QueueDetailsCard;
