import React from "react";
import MainParticipant from "../MainParticipant/MainParticipant";
import BackgroundSelectionDialog from "../BackgroundSelectionDialog/BackgroundSelectionDialog";
import ChatWindow from "../ChatWindow/ChatWindow";
import ParticipantList from "../ParticipantList/ParticipantList";
import "./Room.scss";

const Room = () => {
  return (
    <div className={"room-container"}>
      <MainParticipant />
      <ParticipantList />
      <ChatWindow />
      <BackgroundSelectionDialog/>
    </div>
  );
};
export default Room;
