import React from "react";
import "./MessageInfo.scss";

interface MessageInfoProps {
  author: string;
  dateCreated: string;
  isLocalParticipant: boolean;
}

const MessageInfo = ({ author, dateCreated, isLocalParticipant }: MessageInfoProps) => (
  <div className={"message-info-container"}>
    <div>{isLocalParticipant ? `${author} (You)` : author}</div>
    <div>{dateCreated}</div>
  </div>
);

export default MessageInfo;
