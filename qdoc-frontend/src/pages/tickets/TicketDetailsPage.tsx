import { Button, Card, Descriptions, Divider, Row, Space, Typography } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import { formatDate } from "../../helpers/date-helpers";
import { getBackgroundColor, getPatientsAhead, getTicketInstructions } from "../../helpers/ticket-helpers";
import { waitingTimeCalculator } from "../../helpers/waiting-time-calculator";
import TicketService from "../../services/ticket-service";
import QueueService from "../../services/queue-service";
import { Ticket, TicketStatus, TicketType, getTelemedCallLink } from "../../types/ticket";
import Title from "antd/lib/typography/Title";
import TicketStatusTag from "../../components/Tickets/TicketStatusTag";

const TicketDetailsPage = ({ userId }): ReactElement => {
  const refreshIntervalInMs = 10000;
  const { ticketId } = useParams() as any;
  const [ ticket, setTicket ] = useState<Ticket | null>(null);
  const [ instruction, setInstruction ] = useState<String>("");

  const getTicket = async (): Promise<void> => {
    try {
      const data = await TicketService.getTicket(ticketId);
      await setTicket(data);
      setInstruction(getTicketInstructions(data));
    } catch (e) {
      console.error(e);
    }
  };

  const leaveQueue = async (): Promise<void> => {
    try {
      console.log("leaving");
      await QueueService.closeTicket(ticket.queueId, ticketId);
    } catch (e) {
      console.error(e);
    }
  };

  const isServingTelemedTic = (ticket: Ticket): boolean => {
    return ticket.type === TicketType.TELEMED && ticket.status === TicketStatus.SERVING;
  };

  const telemedCallBtn = (ticket: Ticket): React.ReactElement => {
    return (
      <Link to={getTelemedCallLink(ticket)}>
        <Button type='primary' className='mr-3'>
        Join call with Doctor
        </Button>
      </Link>);
  };

  const leaveQueueBtn = (): React.ReactElement => {
    return (<Button type='primary' onClick={() => leaveQueue()} danger className='mr-3'>
      Leave Queue
    </Button>);
  };

  useEffect(() => {
    getTicket();
    const interval = setInterval(getTicket, refreshIntervalInMs);
    return () => clearInterval(interval);
  }, []);

  if (ticket != null && userId !== ticket.patientId) {
    return (<Redirect to="/" />);
  }

  return (
    <Row justify='center'>
      {ticket && <Card
        className='with-shadow'
        style={{ backgroundColor: getBackgroundColor(ticket) }}
        title={<Title level={2} style={{ textAlign: "center" }}>Ticket Number: {ticket.displayNumber}</Title>}
      >
        <Divider><TicketStatusTag ticketStatus={ticket.status} style={{ fontSize: "25px", padding: 10 }} /></Divider>

        <Descriptions labelStyle={{ backgroundColor: getBackgroundColor(ticket) }}
          bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
          <Descriptions.Item label='Clinic'>{ticket.clinic.name}</Descriptions.Item>
          <Descriptions.Item label='Doctor'>
            Dr {ticket.queue.doctor.firstName} {ticket.queue.doctor.lastName}
          </Descriptions.Item>
          <Descriptions.Item label='Patients before you'>{ticket.queue.pendingTicketIdsOrder.length}</Descriptions.Item>
          <Descriptions.Item label='Estimated waiting time'>
            {waitingTimeCalculator(getPatientsAhead(ticket))}</Descriptions.Item>
          <Descriptions.Item label='Joined queue at'>{formatDate(ticket.createdAt)}</Descriptions.Item>
        </Descriptions>

        {instruction && <Card className='bg-color-error' type="inner"
          style={{ textAlign: "center" }}>
          <Typography.Text>
            {instruction}
          </Typography.Text>
        </Card>}

        <Space direction='horizontal' style={{ width: "100%", justifyContent: "center" }} align="center" >
          {isServingTelemedTic(ticket) && telemedCallBtn(ticket)}
          {ticket.status !== TicketStatus.CLOSED && leaveQueueBtn()}
        </Space>
      </Card>}

    </Row>
  );
};

export default TicketDetailsPage;
