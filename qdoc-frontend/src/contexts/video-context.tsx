import { CreateLocalTrackOptions, LocalAudioTrack, LocalVideoTrack, Room } from "twilio-video";
import { ErrorCallback } from "../types/twilio";
import { createContext, useContext } from "react";
import { BackgroundSettings } from "../hooks/videos/useBackgroundSettings/useBackgroundSettings";

export interface VideoContext {
  room: Room | null;
  localTracks: (LocalAudioTrack | LocalVideoTrack)[];
  isConnecting: boolean;
  connect: (token: string) => Promise<void>;
  onError: ErrorCallback;
  getLocalVideoTrack: (newOptions?: CreateLocalTrackOptions) => Promise<LocalVideoTrack>;
  getLocalAudioTrack: (deviceId?: string) => Promise<LocalAudioTrack>;
  isAcquiringLocalTracks: boolean;
  removeLocalVideoTrack: () => void;
  isSharingScreen: boolean;
  toggleScreenShare: () => void;
  getAudioAndVideoTracks: () => Promise<void>;
  isBackgroundSelectionOpen: boolean;
  setIsBackgroundSelectionOpen: (value: boolean) => void;
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: (settings: BackgroundSettings) => void;
}

export const videoContext = createContext<VideoContext>(null);

const useVideoContext = () => {
  const context = useContext(videoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
export default useVideoContext;
