import AppStateProvider from "../../state/VideoAppState";
import React from "react";
import VideoApp from "./VideoApp";

const VideoAppWithState = () => {
  return (<AppStateProvider>
    <VideoApp/>
  </AppStateProvider>);
};

export default VideoAppWithState;
