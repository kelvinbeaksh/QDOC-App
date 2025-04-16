import React, { PropsWithChildren, ReactElement } from "react";

import Video from "twilio-video";
import { useAppState } from "../../../state/VideoAppState";
import { Modal } from "antd";

interface AboutModalProps {
  open: boolean;
  onClose(): void;
}

const AboutModal = ({ open, onClose }: PropsWithChildren<AboutModalProps>): ReactElement => {
  const { roomType } = useAppState();
  return (
    <Modal title="About" visible={open} onOk={onClose}>
      <p>Browser supported: {String(Video.isSupported)}</p>
      {roomType && <p>Room Type: {roomType}</p>}
    </Modal>
  );
};

export default AboutModal;
