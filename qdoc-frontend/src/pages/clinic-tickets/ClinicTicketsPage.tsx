import React, { ReactElement, useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { Col, Divider, Row } from "antd";
import TicketsTable, { TicketTableRow } from "../../components/Tickets/TicketsTable";
import TicketService from "../../services/ticket-service";
import { useParams } from "react-router-dom";

const ClinicTicketsPage = (): ReactElement => {
  const { clinicId } = useParams();
  const [ticketTableRows, setTicketTableRows] = useState<TicketTableRow[]>([]);

  const getClinicTickets = async (): Promise<void> => {
    try {
      const tickets = await TicketService.getAllTickets({ clinicId });
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

  useEffect(() => {
    getClinicTickets();
  }, []);

  return (
    <Row justify='center'>
      <Col span={24}>
        <Title level={3} style={{ paddingLeft: "10px" }}>
          Clinic Tickets
        </Title>
        <Divider />
        <TicketsTable data={ticketTableRows} />
      </Col>
    </Row>
  );
};

export default ClinicTicketsPage;
