import React, { ReactElement } from "react";
import useVideoContext from "../../../contexts/video-context";
import useRoomState from "../../../hooks/videos/useRoomState/useRoomState";
import { Button, Row, Space, Typography } from "antd";
import ToggleAudioButton from "../ToggleAudioButton/ToggleAudioButton";
import ToggleVideoButton from "../ToggleVideoButton/ToggleVideoButton";
import { isMobile } from "../../../utils/video-helper";
import ToggleScreenShareButton from "../ToggleScreenShareButton/ToggleScreenShareButton";
import VideoMenu from "../VideoMenu/VideoMenu";
import EndCallButton from "../EndCallButton/EndCallButton";
import ToggleChatButton from "../ToggleChatWindow/ToggleChatWindow";

const MenuBar = (): ReactElement => {
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === "reconnecting";
  const { room } = useVideoContext();

  return (
    <>
      {isSharingScreen && (
        <div>
          <Typography.Text>You are sharing your screen</Typography.Text>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </div>
      )}
      <Row justify='center' align='top' style={{ "width": "100%" }}>
        <Space direction='vertical' align={"center"}>
          <Typography.Text><b>Room:</b> {room!.name}</Typography.Text>
          <Space direction='horizontal'>
            <ToggleAudioButton disabled={isReconnecting} />
            <ToggleVideoButton disabled={isReconnecting} />
            {!isSharingScreen && !isMobile && <ToggleScreenShareButton disabled={isReconnecting} />}
            <ToggleChatButton />
            <VideoMenu />
            <EndCallButton />
          </Space>
        </Space>
      </Row>
    </>
  );
};
export default MenuBar;
