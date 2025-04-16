import React, { ReactNode, useCallback, useState } from "react";
import { ConnectOptions, LocalVideoTrack } from "twilio-video";
import { ErrorCallback } from "../types/twilio";
import useScreenShareToggle from "../hooks/videos/useScreenShareToggle/useScreenShareToggle";
import { videoContext } from "../contexts/video-context";
import useRoom from "../hooks/videos/useRoom/useRoom";
import useLocalTracks from "../hooks/videos/useLocalTracks/useLocalTracks";
import useHandleRoomDisconnection from "../hooks/videos/useHandleRoomDisconnection/useHandleRoomDisconnection";
import useHandleTrackPublicationFailed
  from "../hooks/videos/useHandleTrackPublicationFailed/useHandleTrackPublicationFailed";
import useRestartAudioTrackOnDeviceChange
  from "../hooks/videos/useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange";
import useBackgroundSettings from "../hooks/videos/useBackgroundSettings/useBackgroundSettings";
import { SelectedParticipantProvider } from "../hooks/videos/useSelectedParticipant/useSelectedParticipant";
import AttachVisibilityHandler from "../components/Video/AttachVisibilityHandler/AttachVisibilityHandler";

interface VideoProviderProps {
  options?: ConnectOptions;
  onError: ErrorCallback;
  children: ReactNode;
}

export const VideoProvider = ({ options, children, onError = () => {} }: VideoProviderProps) => {
  const onErrorCallback: ErrorCallback = useCallback(
    error => {
      console.error(`ERROR: ${error.message}`, error);
      onError(error);
    },
    [ onError ]
  );

  const {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    isAcquiringLocalTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    getAudioAndVideoTracks
  } = useLocalTracks();
  const { room, isConnecting, connect } = useRoom(localTracks, onErrorCallback, options);

  const [ isSharingScreen, toggleScreenShare ] = useScreenShareToggle(room, onError);

  // Register callback functions to be called on room disconnect.
  useHandleRoomDisconnection(
    room,
    onError,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    isSharingScreen,
    toggleScreenShare
  );
  useHandleTrackPublicationFailed(room, onError);
  useRestartAudioTrackOnDeviceChange(localTracks);

  const [ isBackgroundSelectionOpen, setIsBackgroundSelectionOpen ] = useState(false);
  const videoTrack = localTracks.find(track => !track.name.includes("screen") && track.kind === "video") as
    | LocalVideoTrack
    | undefined;
  const [ backgroundSettings, setBackgroundSettings ] = useBackgroundSettings(videoTrack, room);

  return (
    <videoContext.Provider
      value={{
        room,
        localTracks,
        isConnecting,
        onError: onErrorCallback,
        getLocalVideoTrack,
        getLocalAudioTrack,
        connect,
        isAcquiringLocalTracks,
        removeLocalVideoTrack,
        isSharingScreen,
        toggleScreenShare,
        getAudioAndVideoTracks,
        isBackgroundSelectionOpen,
        setIsBackgroundSelectionOpen,
        backgroundSettings,
        setBackgroundSettings
      }}
    >
      <SelectedParticipantProvider room={room}>{children}</SelectedParticipantProvider>
      <AttachVisibilityHandler/>
    </videoContext.Provider>
  );
};
