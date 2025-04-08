import React from "react";
import useScreenShareParticipant from "../../../hooks/videos/useScreenShareParticipant/useScreenShareParticipant";
import useVideoContext from "../../../contexts/video-context";
import { Button, Tooltip } from "antd";

export const SCREEN_SHARE_TEXT = "Share Screen";
export const STOP_SCREEN_SHARE_TEXT = "Stop Sharing Screen";
export const SHARE_IN_PROGRESS_TEXT = "Cannot share screen when another user is sharing";
export const SHARE_NOT_SUPPORTED_TEXT = "Screen sharing is not supported with this browser";

const ToggleScreenShareButton = (props: { disabled?: boolean }) => {
  const screenShareParticipant = useScreenShareParticipant();
  const { toggleScreenShare } = useVideoContext();
  const disableScreenShareButton = Boolean(screenShareParticipant);
  const isScreenShareSupported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled = props.disabled || disableScreenShareButton || !isScreenShareSupported;

  let tooltipMessage = "";

  if (disableScreenShareButton) {
    tooltipMessage = SHARE_IN_PROGRESS_TEXT;
  }

  if (!isScreenShareSupported) {
    tooltipMessage = SHARE_NOT_SUPPORTED_TEXT;
  }

  return (
    <Tooltip
      data-testid="screen-share-tooltip"
      title={tooltipMessage}
      placement="top"
      style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
    >
      <span>
        <Button
          size={"small"}
          onClick={toggleScreenShare}
          disabled={isDisabled}
        >
          {SCREEN_SHARE_TEXT}
        </Button>
      </span>
    </Tooltip>
  );
};
export default ToggleScreenShareButton;
