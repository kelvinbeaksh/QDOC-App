import { useEffect, useState } from "react";
import useVideoContext from "../../../contexts/video-context";

const useIsRecording = () => {
  const { room } = useVideoContext();
  const [ isRecording, setIsRecording ] = useState(Boolean(room?.isRecording));

  useEffect(() => {
    if (room) {
      setIsRecording(room.isRecording);

      const handleRecordingStarted = () => setIsRecording(true);
      const handleRecordingStopped = () => setIsRecording(false);

      room.on("recordingStarted", handleRecordingStarted);
      room.on("recordingStopped", handleRecordingStopped);

      return () => {
        room.off("recordingStarted", handleRecordingStarted);
        room.off("recordingStopped", handleRecordingStopped);
      };
    }
    return () => {};
  }, [ room ]);

  return isRecording;
};
export default useIsRecording;
