import React from "react";
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from "twilio-video";
import useVideoContext from "../../../contexts/video-context";
import useScreenShareParticipant from "../../../hooks/videos/useScreenShareParticipant/useScreenShareParticipant";
import usePublications from "../../../hooks/videos/usePublications/usePublications";
import useTrack from "../../../hooks/videos/useTrack/useTrack";
import useIsTrackSwitchedOff from "../../../hooks/videos/useIsTrackSwitchedOff/useIsTrackSwitchedOff";
import useParticipantIsReconnecting
  from "../../../hooks/videos/useParticipantIsReconnecting/useParticipantIsReconnecting";
import { Avatar, Typography } from "antd";
import AudioLevelIndicator from "../AudioLevelIndicator/AudioLevelIndicator";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import "./MainParticipantInfo.scss";

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

const MainParticipantInfo = ({ participant, children }: MainParticipantInfoProps) => {
  const { room } = useVideoContext();
  const { localParticipant } = room!;
  const isLocal = localParticipant === participant;

  const screenShareParticipant = useScreenShareParticipant();
  const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;

  const publications = usePublications(participant);
  const videoPublication = publications.find(p => !p.trackName.includes("screen") && p.kind === "video");
  const screenSharePublication = publications.find(p => p.trackName.includes("screen"));

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoEnabled = Boolean(videoTrack);

  const audioPublication = publications.find(p => p.kind === "audio");
  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;

  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  return (
    <div className={`main-participant-info-container 
    ${!isRemoteParticipantScreenSharing && "main-participant-info-container-full-width"}`}>
      <div className={"main-participant-info-inner-container"}>
        <div style={{ display: "flex" }}>
          <div className={"main-participant-info-identity"}>
            <AudioLevelIndicator audioTrack={audioTrack} />
            <Typography.Text style={{ color: "white" }}>
              {participant.identity}
              {isLocal && " (You)"}
              {screenSharePublication && " - Screen"}
            </Typography.Text>
          </div>
          <NetworkQualityLevel participant={participant} />
        </div>
      </div>
      {(!isVideoEnabled || isVideoSwitchedOff) && (
        <div className={"main-participant-info-avatar-container"}>
          <Avatar />
        </div>
      )}
      {isParticipantReconnecting && (
        <div className={"main-participant-reconnecting-container"}>
          <Typography.Text style={{ color: "white" }}>
            Reconnecting...
          </Typography.Text>
        </div>
      )}
      {children}
    </div>
  );
};
export default MainParticipantInfo;
