import { useEffect, useState } from "react";
import { RemoteParticipant } from "twilio-video";
import useVideoContext from "../../../contexts/video-context";
import useDominantSpeaker from "../useDominantSpeaker/useDominantSpeaker";

const useParticipants = () => {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [ participants, setParticipants ] = useState(Array.from(room?.participants.values() ?? []));

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    if (dominantSpeaker) {
      setParticipants(prevParticipants => [
        dominantSpeaker,
        ...prevParticipants.filter(participant => participant !== dominantSpeaker)
      ]);
    }
  }, [ dominantSpeaker ]);

  useEffect(() => {
    if (room) {
      const participantConnected = (participant: RemoteParticipant) =>
        setParticipants(prevParticipants => [ ...prevParticipants, participant ]);
      const participantDisconnected = (participant: RemoteParticipant) =>
        setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      return () => {
        room.off("participantConnected", participantConnected);
        room.off("participantDisconnected", participantDisconnected);
      };
    }
    return () => {};
  }, [ room ]);

  return participants;
};
export default useParticipants;
