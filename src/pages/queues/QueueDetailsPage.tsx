import { Col, Divider, Row } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QueueService from "../../services/queue-service";
import { Queue, QueueStatus } from "../../types/queue";
import { useUserContext } from "../../contexts/user-context";
import QueueDetailsCard, { hasClinicManagementAccess } from "../../components/Queues/QueueDetailsCard";
import TicketsTable, { TicketTableRow } from "../../components/Tickets/TicketsTable";
import TicketService from "../../services/ticket-service";

const QueueDetails = (): ReactElement => {
  const refreshIntervalInMs = 10000;

  const { queueId } = useParams() as any;
  const [ queue, setQueue ] = useState<Queue | null>(null);
  const [ ticketTableRows, setTicketTableRows ] = useState<TicketTableRow[]>([]);
  const { user: { role, doctorId } } = useUserContext();

  const getQueue = async (): Promise<void> => {
    setQueue(await QueueService.getQueueByQueueId(queueId));
  };

  const getQueueTickets = async (): Promise<void> => {
    try {
      const tickets = await TicketService.getAllTickets({ queueId });
      const rows: TicketTableRow[] = [];
      tickets.forEach((ticket) => {
        rows.push({
          key: ticket.id,
          ticketDisplayNumber: ticket.displayNumber,
          patientName: `${ticket.patient.firstName} ${ticket.patient.lastName}`,
          ticketType: ticket.type,
          declaration: false,
          alert: true,
          patientId: ticket.patient.id,
          ticketStatus: ticket.status
        });
      });
      setTicketTableRows(rows);
    } catch (e) {
      console.error(`Error fetching queue tickets ${e.message}`);
    }
  };

  const updateQueue = async (queueStatus: QueueStatus): Promise<void> => {
    try {
      const updatedQueue = await QueueService.update(queue.id, { clinicId: queue.clinicId, status: queueStatus });
      setQueue(updatedQueue);
    } catch (error) {
      console.error(`updateQueue threw error for queue id ${queue.id} and clinicId: ${queue.clinicId}`, error);
    }
  };

  const closeQueue = async (): Promise<void> => {
    try {
      const updatedQueue = await QueueService.closeQueue(queue.id);
      setQueue(updatedQueue);
    } catch (error) {
      console.error(`updateQueue threw error for queue id ${queue.id} and clinicId: ${queue.clinicId}`, error);
    }
  };

  const completeTicket = async (queue: Queue): Promise<void> => {
    try {
      const updatedQueue = await QueueService.closeCurrentTicket(queue);
      setQueue(updatedQueue);
    } catch (error) {
      console.error(`completeTicket threw error for queue id ${queue.id}, 
      clinicId: ${queue.clinicId}, ticketId: ${queue.currentTicketId}`, error);
    }
  };

  const nextTicket = async (queue: Queue): Promise<void> => {
    try {
      const updatedQueue = await QueueService.nextTicket(doctorId, queue.id);
      setQueue(updatedQueue);
    } catch (error) {
      console.error(`nextTicket threw error for queue id ${queue.id}, 
      clinicId: ${queue.clinicId}, ticketId: ${queue.currentTicketId}`, error);
    }
  };

  const missTicket = async (queue: Queue): Promise<void> => {
    try {
      const updatedQueue = await QueueService.missCurrentTicket(queue);
      setQueue(updatedQueue);
    } catch (error) {
      console.error(`missTicket threw error for queue id ${queue.id}, 
      clinicId: ${queue.clinicId}, ticketId: ${queue.currentTicketId}`, error);
    }
  };

  useEffect(() => {
    getQueue();
    getQueueTickets();

    const interval = setInterval(() => {
      getQueue();
      getQueueTickets();
    }, refreshIntervalInMs);
    return () => clearInterval(interval);
  }, []);

  return (
    <Row justify="center">
      {queue && (
        <Col >
          <QueueDetailsCard
            queue={queue}
            updateQueue={updateQueue}
            closeQueue={closeQueue}
            completeTicket={completeTicket}
            nextTicket={nextTicket}
            missTicket={missTicket}
            userRole={role} />
          <Divider />
          {/* {hasClinicManagementAccess(role) && <TicketsTable data={ticketTableRows} />} */}
        </Col>
      )}
    </Row>
  );
};

export default QueueDetails;
