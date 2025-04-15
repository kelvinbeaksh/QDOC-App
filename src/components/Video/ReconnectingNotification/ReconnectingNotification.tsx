import React from "react";
import useRoomState from "../../../hooks/videos/useRoomState/useRoomState";
import { notification } from "antd";

const ReconnectingNotification = () => {
  const roomState = useRoomState();

  if (roomState === "reconnecting") {
    notification.error({ message: "Connection Lost", description: "Reconnecting to room..." });
  }
};
export default ReconnectingNotification;
