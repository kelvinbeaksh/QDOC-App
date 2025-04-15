import React from "react";
import useDevices from "../../../../hooks/videos/useDevices/useDevices";
import { useAppState } from "../../../../state/VideoAppState";
import { Select, Space, Typography } from "antd";

const AudioOutputList = () => {
  const { audioOutputDevices } = useDevices();
  const { activeSinkId, setActiveSinkId } = useAppState();

  return (
    <Space direction="vertical">
      <Typography.Title level={5}>Audio Output</Typography.Title>
      <Space direction="horizontal">
        {audioOutputDevices.length >= 1 ? (
          <Select
            defaultValue={activeSinkId}
            onChange={value => setActiveSinkId(value)}
            style={{ width: "100%" }}>
            {audioOutputDevices.map(device => (
              <Select.Option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Typography.Text>System Default Audio Output</Typography.Text>
        )}
      </Space>
    </Space>
  );
};
export default AudioOutputList;
