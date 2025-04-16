import { useEffect, useState } from "react";
import { Participant } from "twilio-video";

const useParticipantNetworkQualityLevel: (participant: Participant) => number = (participant: Participant) => {
  const [ networkQualityLevel, setNetworkQualityLevel ] = useState(participant.networkQualityLevel);

  useEffect(() => {
    const handleNewtorkQualityLevelChange = (newNetworkQualityLevel: number) =>
      setNetworkQualityLevel(newNetworkQualityLevel);

    setNetworkQualityLevel(participant.networkQualityLevel);
    participant.on("networkQualityLevelChanged", handleNewtorkQualityLevelChange);
    return () => {
      participant.off("networkQualityLevelChanged", handleNewtorkQualityLevelChange);
    };
  }, [ participant ]);

  return networkQualityLevel;
};
export default useParticipantNetworkQualityLevel;
