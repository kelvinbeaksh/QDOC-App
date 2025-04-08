import React, { ReactElement } from "react";
import { QueueStatus } from "../../types/queue";
import { Tag } from "antd";
import "./QueueDetailsCard.scss";

interface QueueStatusTagProps {
  status: QueueStatus,
  className?: string
}

const QUEUE_STATUS_TAG_COLOR_MAP = {
  [QueueStatus.ACTIVE]: "green",
  [QueueStatus.INACTIVE]: "orange",
  [QueueStatus.CLOSED]: "magenta"

};

const QueueStatusTag = ({ status, className }: QueueStatusTagProps): ReactElement => {
  return (<Tag className={className}
    color={QUEUE_STATUS_TAG_COLOR_MAP[status]}>{status}</Tag>
  );
};

export default QueueStatusTag;
