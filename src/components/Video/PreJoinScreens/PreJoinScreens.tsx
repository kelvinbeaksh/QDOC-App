import React, { useEffect, useState } from "react";
import DeviceSelectionScreen from "./DeviceSelectionScreen/DeviceSelectionScreen";
import useVideoContext from "../../../contexts/video-context";
import { Row } from "antd";
import "./PreJoinScreen.scss";
import { useUserContext } from "../../../contexts/user-context";
import MediaErrorNotification from "./MediaErrorSnackbar/MediaErrorNotification";
import { useParams } from "react-router-dom";

const PreJoinScreens = () => {
  const { getAudioAndVideoTracks } = useVideoContext();
  const { user } = useUserContext();
  const { room } = useParams();

  const [ mediaError, setMediaError ] = useState<Error>();

  const fetchAudioAndVideoTracks = async () => {
    try {
      await getAudioAndVideoTracks();
    } catch (e) {
      console.error(`Error acquiring local media: ${e.message}`);
      setMediaError(e);
    }
  };

  useEffect(() => {
    fetchAudioAndVideoTracks();
  }, []);

  return (
    <Row align={"middle"} justify={"center"} style={{ height: "100%" }}>
      {mediaError && <MediaErrorNotification error={mediaError} />}
      <DeviceSelectionScreen
        name={user.email}
        roomName={room}
        data-testid={"device-selection-screen"} />
    </Row>
  );
};
export default PreJoinScreens;
