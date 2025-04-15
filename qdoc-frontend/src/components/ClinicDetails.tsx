import React, { ReactElement } from "react";
import { Queue } from "../types/queue";
import { User } from "../contexts/user-context";
import ClinicDetailsButtons from "./ClinicDetailsButtons";
import { waitingTimeCalculator } from "../helpers/waiting-time-calculator";

type ClinicDetailsCardProps = {
  user: User
  queue: Queue
};

const ClinicDetails = ({ queue, user }: ClinicDetailsCardProps): ReactElement => {
  if (!queue) {
    return <div>No active queue for clinic found</div>;
  }
  const patientsInQueue = queue.currentTicketId ?
    queue.pendingTicketIdsOrder.length + 1 :
    queue.pendingTicketIdsOrder.length;

  return (
    <>
      <div>
        <h5>No. of patients in queue: {patientsInQueue}</h5>
        <h5>Estimated waiting time: {waitingTimeCalculator(queue.pendingTicketIdsOrder.length)} mins</h5>
      </div>
      <ClinicDetailsButtons queue={queue} user={user} />
    </>
  );
};

export default ClinicDetails;
