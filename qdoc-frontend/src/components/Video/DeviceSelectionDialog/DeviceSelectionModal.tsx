import React from "react";
import { Divider, Modal, Typography } from "antd";
import VideoInputList from "./VideoInputList/VideoInputList";
import AudioInputList from "./AudioInputList/AudioInputList";
import AudioOutputList from "./AudioOutputList/AudioOutputList";

const { Title } = Typography;

const DeviceSelectionModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Modal title={<Title level={2}>Audio and Video Settings</Title>} visible={open} onOk={onClose} onCancel={onClose}>
    <Title level={4}>Video</Title>
    <VideoInputList />
    <Divider/>
    <Title level={4}>Audio</Title>
    <AudioInputList />
    <Divider/>
    <AudioOutputList />
    <Divider />
  </Modal>
);
export default DeviceSelectionModal;
