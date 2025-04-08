import React from "react";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";
import { Participant as IParticipant } from "twilio-video";
import ParticipantInfo from "../ParticipantInfo/ParticipantInfo";

interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
}

const Participant = ({
  participant,
  videoOnly,
  enableScreenShare,
  onClick,
  isSelected,
  isLocalParticipant,
  hideParticipant
}: ParticipantProps) => (
  <ParticipantInfo
    participant={participant}
    onClick={onClick}
    isSelected={isSelected}
    isLocalParticipant={isLocalParticipant}
    hideParticipant={hideParticipant}
  >
    <ParticipantTracks
      participant={participant}
      videoOnly={videoOnly}
      enableScreenShare={enableScreenShare}
      isLocalParticipant={isLocalParticipant}
    />
  </ParticipantInfo>
);
export default Participant;
