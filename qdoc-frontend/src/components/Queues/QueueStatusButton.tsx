import React, { ReactElement } from "react";
import { Queue, QueueStatus } from "../../types/queue";
import { Button } from "antd";

const queueStatusButtons = (
  queue: Queue,
  updateQueue: (queueStatus: QueueStatus) => Promise<void>,
  closeQueue: ()=> Promise<void>
): ReactElement[] => {
  return [
    // (queue.status !== QueueStatus.ACTIVE ?
    <Button
      key="start-queue"
      disabled={queue.status === QueueStatus.ACTIVE}
      style={{ background: "green", borderStyle: "none" }}
      onClick={() => updateQueue(QueueStatus.ACTIVE)}>Resume Queue</Button>,
    // : null),

    // (queue.status === QueueStatus.ACTIVE ?
    <Button
      key="pause-queue"
      disabled={queue.status !== QueueStatus.ACTIVE}
      style={{ background: "orange", borderStyle: "none" }}
      onClick={() => updateQueue(QueueStatus.INACTIVE)}>Pause Queue</Button>,
    // : null
    // ),

    // (queue.status !== QueueStatus.CLOSED ?
    <Button
      key="close-queue"
      danger
      disabled={queue.status === QueueStatus.CLOSED}
      onClick={() => closeQueue()}>Close Queue</Button>
    // : null
    // )
  ].filter((btn): btn is ReactElement => btn !== null);
};

export default queueStatusButtons;
