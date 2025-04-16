import React, { ReactElement, useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { Col, Divider, Row, Input, Button, Space, Popover } from "antd";
import TicketsTable, { TicketTableRow } from "../../components/Tickets/TicketsTable";
import TicketService from "../../services/ticket-service";
import { useParams } from "react-router-dom";
import AppointmentsTable, { AppointmentTableRow } from "../../components/Tickets/AppointmentsTable";
import HistoryTable, { HistoryTableRow } from "../../components/Tickets/HistoryTable";
import { TicketStatus } from "../../types/ticket";

enum PageStatus {
  UPCOMING = "Upcoming",
  HISTORY = "History"
}

const ClinicAppointmentsPage = (): ReactElement => {
  const { clinicId } = useParams();
  const [pageView, setPageView] = useState<PageStatus>(PageStatus.UPCOMING);
  const [appointmentTableRows, setAppointmentTableRows] = useState<AppointmentTableRow[]>([]);
  const [appointmentTableResults, setAppointmentTableResults] = useState<AppointmentTableRow[]>([]);
  const [historyTableRows, setHistoryTableRows] = useState<HistoryTableRow[]>([]);
  const [historyTableResults, setHistoryTableResults] = useState<AppointmentTableRow[]>([]);

  const getClinicTickets = async (): Promise<void> => {
    try {
      const tickets = await TicketService.getAllTickets({ clinicId });
      const rows: AppointmentTableRow[] = [];
      const historyRows: HistoryTableRow[] = [];
      tickets.forEach((ticket) => {
        ticket.status !== TicketStatus.CLOSED &&
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
        ticket.status === TicketStatus.CLOSED &&
          historyRows.push({
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
      setAppointmentTableRows(rows);
      setHistoryTableRows(historyRows);
      setAppointmentTableResults(rows);
      setHistoryTableResults(historyRows);
    } catch (e) {
      console.error(`Error fetching queue tickets ${e.message}`);
    }
  };

  useEffect(() => {
    getClinicTickets();
  }, []);

  return (
    <div className='cont'>
      <Row justify='center' style={{ paddingRight: "30px" }}>
        <Col flex='auto'>
          <Row justify='space-between' align='bottom'>
            <Col>
              <Title level={3} style={{ paddingLeft: "10px", marginBottom: "0" }}>
                Appointments
              </Title>
              <Text style={{ paddingLeft: "10px" }}>Your doctor's appointment queue</Text>
            </Col>
            <Col>
              <Input
                type='search'
                style={{ backgroundColor: "transparent" }}
                placeholder='Search for a patient...'
                suffix={<span className={"icofont-search-1"} />}
                onChange={(e) => {
                  setAppointmentTableResults(
                    appointmentTableRows.filter((row) =>
                      row.patientName.toLowerCase().includes(e.target.value.toLowerCase()))
                  );
                  setHistoryTableResults(
                    historyTableRows.filter((row) =>
                      row.patientName.toLowerCase().includes(e.target.value.toLowerCase()))
                  );
                }
                }
              />
            </Col>
          </Row>
          <Row justify='start'>
            <Col>
              <Space>
                <Button
                  style={{ margin: "20px 0px -10px", border: "none" }}
                  type={pageView === PageStatus.UPCOMING ? "primary" : "ghost"}
                  shape='round'
                  onClick={() => setPageView(PageStatus.UPCOMING)}
                >
                  {PageStatus.UPCOMING}
                </Button>
                <Button
                  style={{ margin: "20px 0px -10px", border: "none" }}
                  type={pageView === PageStatus.HISTORY ? "primary" : "ghost"}
                  shape='round'
                  onClick={() => setPageView(PageStatus.HISTORY)}
                >
                  {PageStatus.HISTORY}
                </Button>
              </Space>
            </Col>
          </Row>
          <Divider />
          <Row justify='start'>
            <Col span={24}>
              {pageView === PageStatus.UPCOMING && (
                <AppointmentsTable data={appointmentTableResults}></AppointmentsTable>
              )}
              {pageView === PageStatus.HISTORY && (
                <HistoryTable data={historyTableResults}></HistoryTable>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ClinicAppointmentsPage;
