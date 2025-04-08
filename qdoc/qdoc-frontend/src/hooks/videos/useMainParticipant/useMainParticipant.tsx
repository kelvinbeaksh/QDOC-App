import useVideoContext from "../../../contexts/video-context";
import useDominantSpeaker from "../useDominantSpeaker/useDominantSpeaker";
import useScreenShareParticipant from "../useScreenShareParticipant/useScreenShareParticipant";
import useSelectedParticipant from "../useSelectedParticipant/useSelectedParticipant";
import useParticipants from "../useParticipants/useParticipants";

const useMainParticipant = () => {
  const [ selectedParticipant ] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const dominantSpeaker = useDominantSpeaker();
  const participants = useParticipants();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const remoteScreenShareParticipant = screenShareParticipant !== localParticipant ? screenShareParticipant : null;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  return selectedParticipant || remoteScreenShareParticipant || dominantSpeaker || participants[0] || localParticipant;
};
export default useMainParticipant;
