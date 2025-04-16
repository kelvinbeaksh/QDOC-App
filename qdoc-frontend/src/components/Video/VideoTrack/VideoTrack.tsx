import React, { useRef, useEffect } from "react";
import { LocalVideoTrack, RemoteVideoTrack, Track } from "twilio-video";
import useMediaStreamTrack from "../../../hooks/videos/useMediaStreamTrack/useMediaStreamTrack";
import useVideoTrackDimensions from "../../../hooks/videos/useVideoTrackDimensions/useVideoTrackDimensions";

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

const VideoTrack = ({ track, isLocal, priority }: VideoTrackProps) => {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);
  const dimensions = useVideoTrackDimensions(track);
  const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;

      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [ track, priority ]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== "environment";
  const style = {
    width: "100%",
    height: "100%",
    transform: isLocal && isFrontFacing ? "rotateY(180deg)" : "",
    objectFit: isPortrait || track.name.includes("screen") ? ("contain" as const) : ("cover" as const)
  };

  return <video ref={ref} style={style} />;
};
export default VideoTrack;
