import { Room, TwilioError } from "twilio-video";
import { useEffect } from "react";
import { Callback } from "../../../types/twilio";

const useHandleRoomDisconnection = (
  room: Room | null,
  onError: Callback,
  removeLocalAudioTrack: () => void,
  removeLocalVideoTrack: () => void,
  isSharingScreen: boolean,
  toggleScreenShare: () => void
) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (room) {
      const onDisconnected = (_: Room, error: TwilioError) => {
        if (error) {
          onError(error);
        }

        removeLocalAudioTrack();
        removeLocalVideoTrack();
        if (isSharingScreen) {
          toggleScreenShare();
        }
      };

      room.on("disconnected", onDisconnected);
      return () => {
        room.off("disconnected", onDisconnected);
      };
    }
  }, [ room, onError, removeLocalAudioTrack, removeLocalVideoTrack, isSharingScreen, toggleScreenShare ]);
};
export default useHandleRoomDisconnection;
