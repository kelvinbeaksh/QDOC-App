import React from "react";
import useLocalAudioToggle from "../../../hooks/videos/useLocalAudioToggle/useLocalAudioToggle";
import useVideoContext from "../../../contexts/video-context";
import { Button } from "antd";
import { AudioMutedOutlined, AudioOutlined } from "@ant-design/icons";

const ToggleAudioButton = (props: { disabled?: boolean; className?: string }) => {
  const [ isAudioEnabled, toggleAudioEnabled ] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === "audio");

  return (
    <Button
      onClick={toggleAudioEnabled}
      size="small"
      disabled={!hasAudioTrack || props.disabled}
      icon={isAudioEnabled ? <AudioMutedOutlined/> : <AudioOutlined/>}
    >
      {/* eslint-disable-next-line no-nested-ternary */}
    </Button>
  );
};
export default ToggleAudioButton;
