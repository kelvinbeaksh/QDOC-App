import React, { ReactElement } from "react";
import { getTelemedCallLink, Queue } from "../../types/queue";
import { TicketType } from "../../types/ticket";
import { Button } from "antd-mobile";
import { Link } from "react-router-dom";

function hasPendingTicketsAndNoCurrentTicket(queue: Queue): Boolean {
  return !queue.currentTicketId && queue.pendingTicketIdsOrder.length > 0;
}

function isCurrentTicketTelemed(queue: Queue): Boolean {
  return queue.currentTicket && queue.currentTicket.type === TicketType.TELEMED;
}

const queueCurrentlyServingButtons = (
  queue: Queue,
  nextTicket: (queue: Queue) => Promise<void>,
  completeTicket: (queue: Queue) => Promise<void>,
  missTicket: (queue: Queue) => Promise<void>
): ReactElement[] => {
  return [
    (
      hasPendingTicketsAndNoCurrentTicket(queue) ?
        <Button key="next-ticket" onClick={() => nextTicket(queue)}>Next Ticket</Button> : null
    ),
    (
      isCurrentTicketTelemed(queue) ?
        <Link to={getTelemedCallLink(queue)}>
          <Button key="join-call-with-patient" color="primary">Join telemed call</Button>
        </Link> : null
    ),
    (queue.currentTicketId ? <Button key="missed-ticket" color={"danger"}
      onClick={() => missTicket(queue)}>Missed</Button> : null),
    (queue.currentTicketId ? <Button key="complete-ticket" color="primary"
      onClick={() => completeTicket(queue)}>Complete</Button> : null)
  ].filter((btn): btn is ReactElement => btn !== null);
};

export default queueCurrentlyServingButtons;
