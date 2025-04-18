import { useEffect, useState } from "react";

import { Participant, TrackPublication } from "twilio-video";
import useVideoContext from "../../../contexts/video-context";

/*
  Returns the participant that is sharing their screen (if any). This hook assumes that only one participant
  can share their screen at a time.
*/
const useScreenShareParticipant = () => {
  const { room } = useVideoContext();
  const [ screenShareParticipant, setScreenShareParticipant ] = useState<Participant>();

  useEffect(() => {
    if (room) {
      const updateScreenShareParticipant = () => {
        setScreenShareParticipant(
          Array.from<Participant>(room.participants.values())
            // the screenshare participant could be the localParticipant
            .concat(room.localParticipant)
            .find((participant: Participant) =>
              Array.from<TrackPublication>(participant.tracks.values()).find(track =>
                track.trackName.includes("screen")))
        );
      };
      updateScreenShareParticipant();

      room.on("trackPublished", updateScreenShareParticipant);
      room.on("trackUnpublished", updateScreenShareParticipant);
      room.on("participantDisconnected", updateScreenShareParticipant);

      // the room object does not emit 'trackPublished' events for the localParticipant,
      // so we need to listen for them here.
      room.localParticipant.on("trackPublished", updateScreenShareParticipant);
      room.localParticipant.on("trackUnpublished", updateScreenShareParticipant);
      return () => {
        room.off("trackPublished", updateScreenShareParticipant);
        room.off("trackUnpublished", updateScreenShareParticipant);
        room.off("participantDisconnected", updateScreenShareParticipant);

        room.localParticipant.off("trackPublished", updateScreenShareParticipant);
        room.localParticipant.off("trackUnpublished", updateScreenShareParticipant);
      };
    }
    return () => {};
  }, [ room ]);

  return screenShareParticipant;
};
export default useScreenShareParticipant;
