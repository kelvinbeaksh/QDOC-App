import React, { ReactElement } from "react";
import { Tag } from "antd";
import { TicketStatus } from "../../types/ticket";

const TICKET_STATUS_TAG_COLOR = {
  [TicketStatus.SERVING]: "lime",
  [TicketStatus.WAITING]: "gold",
  [TicketStatus.CLOSED]: "volcano"
};

const TicketStatusTag = (props: { ticketStatus: TicketStatus, style?: React.CSSProperties }): ReactElement => {
  return <Tag style={props.style} color={TICKET_STATUS_TAG_COLOR[props.ticketStatus]}>{props.ticketStatus}</Tag>;
};

export default TicketStatusTag;
