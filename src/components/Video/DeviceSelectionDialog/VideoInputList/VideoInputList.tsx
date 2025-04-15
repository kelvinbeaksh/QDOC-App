import React, { useState } from "react";
import { LocalVideoTrack } from "twilio-video";
import VideoTrack from "../../VideoTrack/VideoTrack";
import useDevices from "../../../../hooks/videos/useDevices/useDevices";
import useVideoContext from "../../../../contexts/video-context";
import useMediaStreamTrack from "../../../../hooks/videos/useMediaStreamTrack/useMediaStreamTrack";
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from "../../../../constants/constants";
import { Select, Space, Typography } from "antd";

const VideoInputList = () => {
  const { videoInputDevices } = useDevices();
  const { localTracks } = useVideoContext();

  const localVideoTrack = localTracks.find(track => track.kind === "video") as LocalVideoTrack | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  const [ storedLocalVideoDeviceId, setStoredLocalVideoDeviceId ] = useState(
    window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)
  );
  const localVideoInputDeviceId = mediaStreamTrack?.getSettings().deviceId || storedLocalVideoDeviceId;

  const replaceTrack = (newDeviceId: string) => {
    // Here we store the device ID in the component state. This is so we can re-render this component display
    // to display the name of the selected device when it is changed while the users camera is off.
    setStoredLocalVideoDeviceId(newDeviceId);
    window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, newDeviceId);
    localVideoTrack?.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: newDeviceId }
    });
  };

  return (
    <Space direction="vertical">
      {localVideoTrack && (
        <div style={{ width: "300px", maxHeight: "200px", margin: "0.5em auto" }}>
          <VideoTrack isLocal track={localVideoTrack} />
        </div>
      )}
      <Space direction="vertical">
        <Typography.Title level={5}>
          Video Input
        </Typography.Title>
        {videoInputDevices.length >= 1 ? (
          <Select
            defaultValue={localVideoInputDeviceId || ""}
            onChange={value => replaceTrack(value)}
            style={{ width: "100%" }}>
            {videoInputDevices.map(device => (
              <Select.Option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Select.Option>
            ))}
          </Select>
        ) : (<Typography.Text>No Video Input</Typography.Text>
        )}
      </Space>
    </Space>
  );
};
export default VideoInputList;
