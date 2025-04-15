import React, { ReactElement } from "react";
import { Tag } from "antd";
import { TicketType } from "../../types/ticket";

const TICKET_TYPE_TAG_COLOR = {
  [TicketType.PHYSICAL]: "geekblue",
  [TicketType.TELEMED]: "purple"
};

const TicketTypeTag = (props: { ticketType: TicketType }): ReactElement => {
  return <Tag color={TICKET_TYPE_TAG_COLOR[props.ticketType]}>{props.ticketType}</Tag>;
};

export default TicketTypeTag;
