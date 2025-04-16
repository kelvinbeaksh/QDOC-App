import React from "react";

import {
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
  AudioTrack as IAudioTrack,
  Track
} from "twilio-video";
import useTrack from "../../../hooks/videos/useTrack/useTrack";
import VideoTrack, { IVideoTrack } from "../VideoTrack/VideoTrack";
import AudioTrack from "../../AudioTrack/AudioTrack";

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocalParticipant?: boolean;
  videoOnly?: boolean;
  videoPriority?: Track.Priority | null;
}

const Publication = ({ publication, isLocalParticipant, videoOnly, videoPriority }: PublicationProps) => {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case "video":
      return (
        <VideoTrack
          track={track as IVideoTrack}
          priority={videoPriority}
          isLocal={!track.name.includes("screen") && isLocalParticipant}
        />
      );
    case "audio":
      return videoOnly ? null : <AudioTrack track={track as IAudioTrack} />;
    default:
      return null;
  }
};
export default Publication;
