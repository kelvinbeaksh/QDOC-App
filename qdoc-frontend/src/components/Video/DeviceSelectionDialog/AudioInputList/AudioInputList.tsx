import React from "react";
import { LocalAudioTrack } from "twilio-video";
import useDevices from "../../../../hooks/videos/useDevices/useDevices";
import useVideoContext from "../../../../contexts/video-context";
import useMediaStreamTrack from "../../../../hooks/videos/useMediaStreamTrack/useMediaStreamTrack";
import { SELECTED_AUDIO_INPUT_KEY } from "../../../../constants/constants";
import AudioLevelIndicator from "../../AudioLevelIndicator/AudioLevelIndicator";
import { Select, Space, Typography } from "antd";

const AudioInputList = () => {
  const { audioInputDevices } = useDevices();
  const { localTracks } = useVideoContext();

  const localAudioTrack = localTracks.find(track => track.kind === "audio") as LocalAudioTrack;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const localAudioInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  const replaceTrack = (newDeviceId: string) => {
    window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, newDeviceId);
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  };

  return (
    <Space direction="vertical">
      <Typography.Title level={5}>Audio Input</Typography.Title>
      <Space direction="horizontal">
        {audioInputDevices.length >= 1 ? (
          <Select
            defaultValue={localAudioInputDeviceId || ""}
            onChange={value => replaceTrack(value)}
            style={{ width: "100%" }}>
            {audioInputDevices.map(device => (
              <Select.Option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Typography.Text>No Video Input</Typography.Text>
        )}
        <AudioLevelIndicator audioTrack={localAudioTrack} color="black" />
      </Space>
    </Space>
  );
};
export default AudioInputList;
