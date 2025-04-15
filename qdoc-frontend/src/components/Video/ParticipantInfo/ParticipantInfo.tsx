import React from "react";
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from "twilio-video";

import AudioLevelIndicator from "../AudioLevelIndicator/AudioLevelIndicator";
import usePublications from "../../../hooks/videos/usePublications/usePublications";
import { Avatar, Typography } from "antd";
import PinIcon from "./PinIcon/PinIcon";
import ScreenShareIcon from "../Icons/ScreenShareIcon";
import useTrack from "../../../hooks/videos/useTrack/useTrack";
import useIsTrackSwitchedOff from "../../../hooks/videos/useIsTrackSwitchedOff/useIsTrackSwitchedOff";
import useParticipantIsReconnecting
  from "../../../hooks/videos/useParticipantIsReconnecting/useParticipantIsReconnecting";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import Icon, { UserOutlined } from "@ant-design/icons";
import "./ParticipantInfo.scss";

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
}

const ParticipantInfo = ({
  participant,
  onClick,
  isSelected,
  children,
  isLocalParticipant,
  hideParticipant
}: ParticipantInfoProps) => {
  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === "audio");
  const videoPublication = publications.find(p => !p.trackName.includes("screen") && p.kind === "video");

  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes("screen"));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const divStyle = {
    ...(hideParticipant && { display: "none" }),
    ...(Boolean(onClick) && { cursor: "pointer" })
  };
  return (
    <div className="participant-info-overall-container"
      data-testid="participant-info" onClick={onClick} style={divStyle}>
      <div className="participant-info-container">
        <NetworkQualityLevel participant={participant} />
        <div className="participant-info-row-bottom">
          {isScreenShareEnabled &&
            <span className="participant-info-screen-share-icon-container">
              <Icon data-testid="screen-share" component={ScreenShareIcon} />
            </span>
          }
          <span className="participant-identity">
            <AudioLevelIndicator audioTrack={audioTrack} />
            <Typography.Text className={"participant-info-typography"}>
              {participant.identity}
              {isLocalParticipant && " (You)"}
            </Typography.Text>
          </span>
        </div>
        {isSelected && <PinIcon />}
      </div>
      <div className="participant-info-inner-container">
        {(!isVideoEnabled || isVideoSwitchedOff) && (
          <div className="participant-info-avatar-container">
            <Avatar icon={<UserOutlined/>} />
          </div>
        )}
        {isParticipantReconnecting && (
          <div className="participant-info-reconnecting-container">
            <Typography.Text >Reconnecting...</Typography.Text>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
export default ParticipantInfo;
