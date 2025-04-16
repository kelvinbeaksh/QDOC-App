import React, { useState } from "react";

import { isSupported } from "@twilio/video-processors";

import { VideoRoomMonitor } from "@twilio/video-room-monitor";
import { Button, Dropdown, Menu, Typography } from "antd";
import DeviceSelectionModal from "../DeviceSelectionDialog/DeviceSelectionModal";
import AboutModal from "../AboutModal/AboutModal";
import { InfoCircleOutlined, PictureOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import useChatContext from "../../../hooks/videos/useChatContext/useChatContext";
import useVideoContext from "../../../contexts/video-context";
import FlipCameraIcon from "../Icons/FlipCameraIcon";
import useFlipCameraToggle from "../../../hooks/videos/useFlipCameraToggle/useFlipCameraToggle";

const VideoMenu = () => {
  const [ aboutOpen, setAboutOpen ] = useState(false);
  const [ settingsOpen, setSettingsOpen ] = useState(false);

  const { setIsChatWindowOpen } = useChatContext();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } = useFlipCameraToggle();

  const menu = (<Menu>
    <Menu.Item onClick={() => setSettingsOpen(true)}>
      <SettingOutlined />
      <Typography.Text>Audio and Video Settings</Typography.Text>
    </Menu.Item>

    {isSupported && (
      <Menu.Item
        onClick={() => {
          setIsBackgroundSelectionOpen(true);
          setIsChatWindowOpen(false);
        }}
      >
        <PictureOutlined />
        <Typography.Text>Backgrounds</Typography.Text>
      </Menu.Item>
    )}

    {flipCameraSupported && (
      <Menu.Item disabled={flipCameraDisabled} onClick={toggleFacingMode}>
        <FlipCameraIcon />
        <Typography.Text>Flip Camera</Typography.Text>
      </Menu.Item>
    )}

    <Menu.Item onClick={() => {
      VideoRoomMonitor.toggleMonitor();
    }}>
      <SearchOutlined />
      <Typography.Text>Room Monitor</Typography.Text>
    </Menu.Item>
    <Menu.Item onClick={() => setAboutOpen(true)}>
      <InfoCircleOutlined />
      <Typography.Text>About</Typography.Text>
    </Menu.Item>
  </Menu>);

  return (<>
    <Dropdown overlay={menu} placement={"topCenter"}>
      <Button size='small' icon={<SettingOutlined />} />
    </Dropdown>

    <AboutModal
      open={aboutOpen}
      onClose={() => {
        setAboutOpen(false);
      }}
    />
    <DeviceSelectionModal
      open={settingsOpen}
      onClose={() => {
        setSettingsOpen(false);
      }}
    />
  </>
  );
};
export default VideoMenu;
