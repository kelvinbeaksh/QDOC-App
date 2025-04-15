import React from "react";
import useVideoContext from "../../../contexts/video-context";
import useMainParticipant from "../../../hooks/videos/useMainParticipant/useMainParticipant";
import useSelectedParticipant from "../../../hooks/videos/useSelectedParticipant/useSelectedParticipant";
import useScreenShareParticipant from "../../../hooks/videos/useScreenShareParticipant/useScreenShareParticipant";
import MainParticipantInfo from "../MainParticipantInfo/MainParticipantInfo";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";

const MainParticipant = () => {
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const { localParticipant } = room!;
  const [ selectedParticipant ] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    (mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant) &&
    mainParticipant !== localParticipant
      ? "high"
      : null;

  return (
    /* audio is disabled for this participant component because this participant's audio
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks
        participant={mainParticipant}
        videoOnly
        enableScreenShare={mainParticipant !== localParticipant}
        videoPriority={videoPriority}
        isLocalParticipant={mainParticipant === localParticipant}
      />
    </MainParticipantInfo>
  );
};
export default MainParticipant;
