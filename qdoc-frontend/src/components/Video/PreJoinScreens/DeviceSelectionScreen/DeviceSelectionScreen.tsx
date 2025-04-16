import React, { ReactElement } from "react";
import LocalVideoPreview from "./LocalVideoPreview/LocalVideoPreview";
import SettingsMenu from "./SettingsMenu/SettingsMenu";
import useVideoContext from "../../../../contexts/video-context";
import useChatContext from "../../../../hooks/videos/useChatContext/useChatContext";
import { useAppState } from "../../../../state/VideoAppState";
import { Button, Card, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ToggleAudioButton from "../../ToggleAudioButton/ToggleAudioButton";
import ToggleVideoButton from "../../ToggleVideoButton/ToggleVideoButton";
import { useHistory } from "react-router-dom";
import useLocalVideoToggle from "../../../../hooks/videos/useLocalVideoToggle/useLocalVideoToggle";

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
}

const DeviceSelectionScreen = ({ name, roomName }: DeviceSelectionScreenProps): ReactElement => {
  const { getToken, isFetching } = useAppState();
  const history = useHistory();
  const [ isVideoEnabled, toggleVideoEnabled ] = useLocalVideoToggle();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  const joinVideoAndChat = async () : Promise<void> => {
    try {
      const { token } = await getToken(name, roomName);
      await videoConnect(token);
      await chatConnect(token);
    } catch (e) {
      console.error(e);
    }
  };

  if (isFetching || isConnecting) {
    return (
      <div>
        <LoadingOutlined spin />
        <Typography.Text style={{ fontWeight: "bold", fontSize: "16px" }}>
          Joining Meeting
        </Typography.Text>
      </div>
    );
  }

  return (
    <Card title="Camera Preview"
      className="with-shadow"
      style={{ width: "70%" }}
      actions={[
        <ToggleAudioButton key="audio" disabled={disableButtons} />,
        <ToggleVideoButton key="video" disabled={disableButtons} />,
        <SettingsMenu key="settings"/>,
        <Button size="small" key="cancel" onClick={() => {
          if (isVideoEnabled) {
            toggleVideoEnabled();
          }
          history.push("/");
        }}>Cancel</Button>,
        <Button size="small" key="join now" onClick={joinVideoAndChat} disabled={disableButtons}>Join</Button>
      ]}
    >
      <LocalVideoPreview identity={name} />
    </Card>
  );
};
export default DeviceSelectionScreen;
