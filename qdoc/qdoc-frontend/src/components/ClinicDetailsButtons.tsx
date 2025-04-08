/* eslint-disable @typescript-eslint/no-shadow */
import React, { ReactElement, useEffect, useState } from "react";
import { Queue } from "../types/queue";
import { User } from "../contexts/user-context";
import { UserRoles } from "../clients/auth-client";
import { Button, Space } from "antd";
import { Link, useHistory } from "react-router-dom";
import { PhoneOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import TicketService from "../services/ticket-service";
import { Ticket, TicketStatus, TicketType } from "../types/ticket";

type ClinicDetailsButtonsProps = {
  user: User
  queue: Queue
};

interface HandleJoinQueueCb {
  (): Promise<void>
}

const ClinicDetailsButtons = ({ queue, user }: ClinicDetailsButtonsProps): ReactElement => {
  const [ ticket, setTicket ] = useState<Ticket>(null);
  const [ isPatientInClinicQueue, setPatientInClinicQueue ] = useState<Boolean>(false);
  const history = useHistory();

  const checkPatientInClinicQueue = async (queue: Queue, user: User): Promise<void> => {
    try {
      const tickets = await TicketService.getAllTickets({
        patientId: user.patientId,
        queueId: queue.id,
        status: [ TicketStatus.SERVING, TicketStatus.WAITING ]
      });
      if (tickets.length > 0) {
        setTicket(tickets[0]);
        setPatientInClinicQueue(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user.role === UserRoles.PATIENT) {
      checkPatientInClinicQueue(queue, user);
    }
  }, []);

  if (isPatientInClinicQueue) {
    const ticketDetailsOnClick = (): void =>
      history.push(`/tickets/${ticket.id}`);

    return (
      <Button onClick={ticketDetailsOnClick} type='primary' className='mr-3'>
        Ticket Details <UsergroupAddOutlined className='ml-2' />
      </Button>
    );
  }

  const handleJoinQueue = (ticketType: TicketType): HandleJoinQueueCb => {
    return async (): Promise<void> => {
      try {
        const createdTicket = await TicketService.createTicket(user.patientId, queue.id, queue.clinicId, ticketType);
        history.push(`/tickets/${createdTicket.id}`);
      } catch (e) {
        console.error(e);
      }
    };
  };

  return (
    <Space direction="horizontal">
      <Button onClick={handleJoinQueue(TicketType.PHYSICAL)} type='primary' disabled>
        Join Queue <UsergroupAddOutlined className='ml-2' />
      </Button>
      <Button onClick={handleJoinQueue(TicketType.TELEMED)} type='primary'>
        Tele-consult <PhoneOutlined className='ml-2' />
      </Button>
    </Space>
  );
};

export default ClinicDetailsButtons;
