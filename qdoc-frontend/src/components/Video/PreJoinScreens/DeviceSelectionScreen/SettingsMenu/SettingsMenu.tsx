import React, { useState } from "react";
import { useAppState } from "../../../../../state/VideoAppState";
import { Button, Dropdown, Menu, Space } from "antd";
import AboutModal from "../../../AboutModal/AboutModal";
import DeviceSelectionModal from "../../../DeviceSelectionDialog/DeviceSelectionModal";
import ConnectionOptionsDialog from "../../../ConnectionOptionsDialog/ConnectionOptionsDialog";
import { SettingFilled } from "@ant-design/icons";

const SettingsMenu = () => {
  const [ aboutOpen, setAboutOpen ] = useState(false);
  const [ deviceSettingsOpen, setDeviceSettingsOpen ] = useState(false);
  const [ connectionSettingsOpen, setConnectionSettingsOpen ] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setAboutOpen(true)}>About</Menu.Item>
      <Menu.Item onClick={() => setDeviceSettingsOpen(true)}>Audio and Video Settings</Menu.Item>
      <Menu.Item onClick={() => setConnectionSettingsOpen(true)}>Connection Settings</Menu.Item>
    </Menu>
  );

  return (
    <Space direction="horizontal">
      <Dropdown overlay={menu} placement="topRight">
        <Button size='small' icon={<SettingFilled />}/>
      </Dropdown>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)}/>
      <DeviceSelectionModal open={deviceSettingsOpen} onClose={() => setDeviceSettingsOpen(false)}/>
      <ConnectionOptionsDialog open={connectionSettingsOpen} onClose={() => setConnectionSettingsOpen(false)}/>
    </Space>
  );
};
export default SettingsMenu;
