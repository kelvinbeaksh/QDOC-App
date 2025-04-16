import React from "react";
import { LocalAudioTrack } from "twilio-video";
import AudioLevelIndicator from "../AudioLevelIndicator/AudioLevelIndicator";
import useVideoContext from "../../../contexts/video-context";

const LocalAudioLevelIndicator = ({ color }) => {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === "audio") as LocalAudioTrack;

  return <AudioLevelIndicator audioTrack={audioTrack} color={color}/>;
};
export default LocalAudioLevelIndicator;
