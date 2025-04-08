import React, { useCallback, useRef } from "react";
import useLocalVideoToggle from "../../../hooks/videos/useLocalVideoToggle/useLocalVideoToggle";
import useDevices from "../../../hooks/videos/useDevices/useDevices";
import { Button } from "antd";
import { VideoCameraFilled, VideoCameraOutlined } from "@ant-design/icons";

const ToggleVideoButton = (props: { disabled?: boolean; className?: string }) => {
  const [ isVideoEnabled, toggleVideoEnabled ] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const { hasVideoInputDevices } = useDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [ toggleVideoEnabled ]);

  return (
    <Button
      size="small"
      onClick={toggleVideo}
      disabled={!hasVideoInputDevices || props.disabled}
      icon={
        isVideoEnabled ?
          <VideoCameraFilled /> :
          <VideoCameraOutlined />
      }
    />
  );
};
export default ToggleVideoButton;
