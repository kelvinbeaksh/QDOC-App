import React, { ReactElement } from "react";
import { VideoProvider } from "../../providers/VideoProvider";
import { useAppState } from "../../state/VideoAppState";
import { ChatProvider } from "../../providers/ChatProvider";
import useConnectionOptions from "../../hooks/videos/useConnectionOptions/useConnectionOptions";
import PreJoinScreens from "./PreJoinScreens/PreJoinScreens";
import useRoomState from "../../hooks/videos/useRoomState/useRoomState";
import Room from "./Room/Room";
import MenuBar from "./MenuBar/MenuBar";
import { Layout } from "antd";
import useHeight from "../../hooks/videos/useHeight/useHeight";
import "./VideoApp.scss";
import ErrorNotification from "./ErrorNotification/ErrorNotification";

const VideoApp = (): ReactElement => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ChatProvider>
        {error && <ErrorNotification error={error} />}
        <App />
      </ChatProvider>
    </VideoProvider>
  );
};

export default VideoApp;

const App = (): ReactElement => {
  const roomState = useRoomState();
  const height = useHeight();

  return (
    <>
      {roomState === "disconnected" ?
        <Layout.Content style={{ height }}>
          <PreJoinScreens />
        </Layout.Content> :
        <>
          <Layout.Content style={{ height }} data-testid='video-room'>
            <Room />
          </Layout.Content>
          <Layout.Footer data-testid='video-footer' className={"video-footer"}>
            <MenuBar />
          </Layout.Footer>
        </>
      }
    </>);
};
