import { Room } from "twilio-video";
import { useEffect } from "react";
import { Callback } from "../../../types/twilio";

const useHandleTrackPublicationFailed = (room: Room | null, onError: Callback) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (room) {
      room.localParticipant.on("trackPublicationFailed", onError);
      return () => {
        room.localParticipant.off("trackPublicationFailed", onError);
      };
    }
  }, [ room, onError ]);
};
export default useHandleTrackPublicationFailed;
