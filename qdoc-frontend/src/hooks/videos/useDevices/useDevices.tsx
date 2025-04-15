import { useEffect, useState } from "react";
import { getDeviceInfo } from "../../../utils/video-helper";
import { DeviceInfo } from "../../../types/twilio";

const useDevices = () => {
  const [ deviceInfo, setDeviceInfo ] = useState<DeviceInfo>({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
    hasAudioInputDevices: false,
    hasVideoInputDevices: false
  });

  const getDevices = async (): Promise<void> => {
    const devices = await getDeviceInfo();
    setDeviceInfo(devices);
  };

  useEffect(() => {
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    getDevices();
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
      setDeviceInfo({
        audioInputDevices: [],
        videoInputDevices: [],
        audioOutputDevices: [],
        hasAudioInputDevices: false,
        hasVideoInputDevices: false
      });
    };
  }, []);

  return deviceInfo;
};
export default useDevices;
