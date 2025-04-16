import React, { ReactElement } from "react";
import useVideoContext from "../../../contexts/video-context";
import useParticipants from "../../../hooks/videos/useParticipants/useParticipants";
import useSelectedParticipant from "../../../hooks/videos/useSelectedParticipant/useSelectedParticipant";
import useScreenShareParticipant from "../../../hooks/videos/useScreenShareParticipant/useScreenShareParticipant";
import useMainParticipant from "../../../hooks/videos/useMainParticipant/useMainParticipant";
import Participant from "../Participant/Participant";
import "./ParticipantList.scss";

const ParticipantList = (): ReactElement | null => {
  const { room } = useVideoContext();
  const { localParticipant } = room!;
  const participants = useParticipants();
  const [ selectedParticipant, setSelectedParticipant ] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const mainParticipant = useMainParticipant();

  if (participants.length === 0) return null; // Don't render this component if there are no remote participants.
  return (
    <aside className={"participant-list-container"}>
      <div className={"participant-list-scroll-container"}>
        <div className={"participant-list-inner-scroll-container"}>
          <Participant participant={localParticipant} isLocalParticipant={true} />
          {participants.map(participant => {
            const isSelected = participant === selectedParticipant;
            const hideParticipant =
              participant === mainParticipant && participant !== screenShareParticipant && !isSelected;
            return (
              <Participant
                key={participant.sid}
                participant={participant}
                isSelected={participant === selectedParticipant}
                onClick={() => setSelectedParticipant(participant)}
                hideParticipant={hideParticipant}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};
export default ParticipantList;
