import { useState, useCallback, useRef } from "react";
import { LogLevels, Track, Room } from "twilio-video";
import { ErrorCallback } from "../../../types/twilio";

interface MediaStreamTrackPublishOptions {
  name?: string;
  priority: Track.Priority;
  logLevel: LogLevels;
}

const useScreenShareToggle = (room: Room | null, onError: ErrorCallback) => {
  const [ isSharing, setIsSharing ] = useState(false);
  const stopScreenShareRef = useRef<() => void>(null!);

  const shareScreen = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
          frameRate: 10,
          height: 1080,
          width: 1920
        }
      });
      const track = mediaStream.getTracks()[0];
      try {
        const trackPublication = await room!.localParticipant
          .publishTrack(track, {
            name: "screen", // Tracks can be named to easily find them later
            priority: "low" // Priority is set to high by the subscriber when the video track is rendered
          } as MediaStreamTrackPublishOptions);
        stopScreenShareRef.current = () => {
          room!.localParticipant.unpublishTrack(track);
          // TODO: remove this if the SDK is updated to emit this event
          room!.localParticipant.emit("trackUnpublished", trackPublication);
          track.stop();
          setIsSharing(false);
        };
        track.onended = stopScreenShareRef.current;
        setIsSharing(true);
      } catch (e) {
        onError(e);
      }
    } catch (e) {
      if (e.name !== "AbortError" && e.name !== "NotAllowedError") {
        onError(e);
      }
    }
  }, [ room, onError ]);

  const toggleScreenShare = useCallback(() => {
    if (room) {
      !isSharing ? shareScreen() : stopScreenShareRef.current();
    }
  }, [ isSharing, shareScreen, room ]);

  return [ isSharing, toggleScreenShare ] as const;
};
export default useScreenShareToggle;
