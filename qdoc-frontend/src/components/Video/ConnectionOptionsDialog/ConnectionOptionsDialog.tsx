import React, { useCallback } from "react";
import { useAppState } from "../../../state/VideoAppState";
import useRoomState from "../../../hooks/videos/useRoomState/useRoomState";
import { Settings } from "../../../state/settings/settingsReducer";
import { Modal, Space, Typography, Select, InputNumber } from "antd";

const withDefault = (val?: string) => (typeof val === "undefined" ? "default" : val);

const ConnectionOptionsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { settings, dispatchSetting } = useAppState();
  const roomState = useRoomState();
  const isDisabled = roomState !== "disconnected";

  const handleChange = useCallback((key: string, value: string) => {
    dispatchSetting({ name: key as keyof Settings, value });
  }, [ dispatchSetting ]);

  return (
    <Modal visible={open} onCancel={onClose}>
      <Space direction="vertical">
        <p>Connection Settings</p>
        { isDisabled && <Typography.Text>These settings cannot be changed when connected to a room.</Typography.Text>}
        <Typography.Title level={5}>Dominant Speaker Priority</Typography.Title>
        <Select
          disabled={isDisabled}
          value={withDefault(settings.dominantSpeakerPriority)}
          onChange={(value) => handleChange("dominantSpeakerPriority", value)}>
          <Select.Option value="low">Low</Select.Option>
          <Select.Option value="standard">Standard</Select.Option>
          <Select.Option value="high">High</Select.Option>
          <Select.Option value="default">Server Default</Select.Option>
        </Select>

        <Typography.Title level={5}>Track Switch Off Mode</Typography.Title>
        <Select
          disabled={isDisabled}
          value={withDefault(settings.trackSwitchOffMode)}
          onChange={(value) => handleChange("trackSwitchOffMode", value)}>
          <Select.Option value="predicted">Predicted</Select.Option>
          <Select.Option value="detected">Detected</Select.Option>
          <Select.Option value="disabled">Disabled</Select.Option>
          <Select.Option value="default">Server Default</Select.Option>
        </Select>

        <Typography.Title level={5}>Mode</Typography.Title>
        <Select
          disabled={isDisabled}
          value={withDefault(settings.bandwidthProfileMode)}
          onChange={(value) => handleChange("bandwidthProfileMode", value)}>
          <Select.Option value="grid">Grid</Select.Option>
          <Select.Option value="collaboration">Collaboration</Select.Option>
          <Select.Option value="presentation">Presentation</Select.Option>
          <Select.Option value="default">Server Default</Select.Option>
        </Select>

        <Typography.Title level={5}>Client Track Switch Off Control</Typography.Title>
        <Select
          disabled={isDisabled}
          value={withDefault(settings.clientTrackSwitchOffControl)}
          onChange={(value) => handleChange("clientTrackSwitchOffControl", value)}>
          <Select.Option value="auto">Auto</Select.Option>
          <Select.Option value="manual">Manual</Select.Option>
          <Select.Option value="default">Default</Select.Option>
        </Select>

        <Typography.Title level={5}>Content Preferences Mode</Typography.Title>
        <Select
          disabled={isDisabled}
          value={withDefault(settings.contentPreferencesMode)}
          onChange={(value) => handleChange("contentPreferencesMode", value)}>
          <Select.Option value="auto">Auto</Select.Option>
          <Select.Option value="manual">Manual</Select.Option>
          <Select.Option value="default">Default</Select.Option>
        </Select>

        <Typography.Title level={5}>Max Audio Bitrate</Typography.Title>
        <InputNumber disabled={isDisabled} min={"0"} defaultValue={withDefault(settings.maxAudioBitrate)}
          onChange={(value) => handleChange("maxAudioBitrate", value)}/>
      </Space>
    </Modal>
  );
};
export default ConnectionOptionsDialog;
