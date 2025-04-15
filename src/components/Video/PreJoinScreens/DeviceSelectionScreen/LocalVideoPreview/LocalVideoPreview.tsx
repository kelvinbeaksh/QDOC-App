import React from "react";
import LocalAudioLevelIndicator from "../../../LocalAudioLevelIndicator/LocalAudioLevelIndicator";
import { LocalVideoTrack } from "twilio-video";
import VideoTrack from "../../../VideoTrack/VideoTrack";
import useVideoContext from "../../../../../contexts/video-context";
import { Avatar, Typography } from "antd";
import "./LocalVideoPreview.scss";
import { UserOutlined } from "@ant-design/icons";

const LocalVideoPreview = ({ identity }: { identity: string }) => {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(
    track => !track.name.includes("screen") && track.kind === "video"
  ) as LocalVideoTrack;

  return (
    <div className={"container"}>
      <div className={"inner-container"}>
        {videoTrack ?
          <VideoTrack track={videoTrack} isLocal /> :
          <div className={"avatar"}>
            <Avatar size="large" icon={<UserOutlined />}/>
          </div>
        }
      </div>

      <div className={"identity-container"}>
        <span className={"identity"}>
          <LocalAudioLevelIndicator color={"white"}/>
          <Typography.Text style={{ color: "white" }}>{identity}</Typography.Text>
        </span>
      </div>
    </div>
  );
};
export default LocalVideoPreview;
