import React, { ReactElement } from "react";
import TicketDetailsItem from "../Tickets/TicketDetailsItem";
import { formatDate } from "../../helpers/date-helpers";
import { Card } from "antd";

const QueueTicketDetails = ({ title, ticket }): ReactElement => {
  if (ticket) {
    return (
      <Card title={title}>
        <TicketDetailsItem>Display Number: <b>{ticket.displayNumber}</b></TicketDetailsItem>
        <TicketDetailsItem>Type: <b>{ticket.type}</b></TicketDetailsItem>
        <TicketDetailsItem>Patient Id: <b>{ticket.patientId}</b></TicketDetailsItem>
        <TicketDetailsItem>Created At: <b>{formatDate(ticket.createdAt)}</b></TicketDetailsItem>
      </Card>
    );
  }
  return (<></>);
};

export default QueueTicketDetails;
