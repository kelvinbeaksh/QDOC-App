import { useCallback, useEffect, useState } from "react";
import useDevices from "../useDevices/useDevices";
import { SELECTED_AUDIO_OUTPUT_KEY } from "../../../constants/constants";

export default function useActiveSinkId() {
  const { audioOutputDevices } = useDevices();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [ activeSinkId, _setActiveSinkId ] = useState("default");

  const setActiveSinkId = useCallback((sinkId: string) => {
    window.localStorage.setItem(SELECTED_AUDIO_OUTPUT_KEY, sinkId);
    _setActiveSinkId(sinkId);
  }, []);

  useEffect(() => {
    const selectedSinkId = window.localStorage.getItem(SELECTED_AUDIO_OUTPUT_KEY);
    const hasSelectedAudioOutputDevice = audioOutputDevices.some(
      device => selectedSinkId && device.deviceId === selectedSinkId
    );
    if (hasSelectedAudioOutputDevice) {
      _setActiveSinkId(selectedSinkId!);
    }
  }, [ audioOutputDevices ]);

  return [ activeSinkId, setActiveSinkId ] as const;
}
