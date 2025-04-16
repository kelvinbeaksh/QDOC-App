import React from "react";
import { Participant } from "twilio-video";
import useParticipantNetworkQualityLevel
  from "../../../hooks/videos/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel";
import "./NetworkQualityLevel.scss";

const STEP = 3;
const BARS_ARRAY = [ 0, 1, 2, 3, 4 ];

const NetworkQualityLevel = ({ participant }: { participant: Participant }) => {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);

  if (networkQualityLevel === null) return null;

  return (
    <div className={"network-quality-level-outer-container"}>
      <div className={"network-quality-level-inner-container"}>
        {BARS_ARRAY.map(level => (
          <div
            key={level}
            style={{
              height: `${STEP * (level + 1)}px`,
              background: networkQualityLevel > level ? "white" : "rgba(255, 255, 255, 0.2)"
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default NetworkQualityLevel;
