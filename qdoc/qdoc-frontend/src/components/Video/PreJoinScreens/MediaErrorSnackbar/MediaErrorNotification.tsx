import React, { ReactElement, useEffect } from "react";
import useVideoContext from "../../../../contexts/video-context";
import useDevices from "../../../../hooks/videos/useDevices/useDevices";
import { notification } from "antd";

export const getMediaErrorNotificationContent = (hasAudio: boolean, hasVideo: boolean, error?: Error) => {
  let headline = "";
  let message = "";

  // eslint-disable-next-line default-case
  switch (true) {
    // These custom errors are thrown by the useLocalTracks hook. They are thrown when the user explicitly denies
    // permission to only their camera, or only their microphone.
    case error?.message === "CameraPermissionsDenied":
      headline = "Unable to Access Media:";
      message =
        "The user has denied permission to use video. Please grant permission to the browser to access the camera.";
      break;
    case error?.message === "MicrophonePermissionsDenied":
      headline = "Unable to Access Media:";
      message =
        "The user has denied permission to use audio. Please grant permission to the browser to access the microphone.";
      break;

    // This error is emitted when the user or the user's system has denied permission to use the media devices
    case error?.name === "NotAllowedError":
      headline = "Unable to Access Media:";

      if (error!.message === "Permission denied by system") {
        // Chrome only
        message =
          "The operating system has blocked the browser from accessing the microphone or camera. " +
          "Please check your operating system settings.";
      } else {
        message =
          "The user has denied permission to use audio and video. " +
          "Please grant permission to the browser to access the microphone and camera.";
      }

      break;

    // This error is emitted when input devices are not connected or disabled in the OS settings
    case error?.name === "NotFoundError":
      headline = "Cannot Find Microphone or Camera:";
      message =
        "The browser cannot access the microphone or camera. " +
        "Please make sure all input devices are connected and enabled.";
      break;

    // Other getUserMedia errors are less likely to happen in this app. Here we will display
    // the system's error message directly to the user.
    case Boolean(error):
      headline = "Error Acquiring Media:";
      message = `${error!.name} ${error!.message}`;
      break;

    case !hasAudio && !hasVideo:
      headline = "No Camera or Microphone Detected:";
      message = "Other participants in the room will be unable to see and hear you.";
      break;

    case !hasVideo:
      headline = "No Camera Detected:";
      message = "Other participants in the room will be unable to see you.";
      break;

    case !hasAudio:
      headline = "No Microphone Detected:";
      message = "Other participants in the room will be unable to hear you.";
  }

  return {
    headline,
    message
  };
};

const MediaErrorNotification = (props: { error?: Error }): ReactElement => {
  const { hasAudioInputDevices, hasVideoInputDevices } = useDevices();

  const { isAcquiringLocalTracks } = useVideoContext();
  const showNotification =
    !isAcquiringLocalTracks &&
    (Boolean(props.error) || !hasAudioInputDevices || !hasVideoInputDevices);

  useEffect(() => {
    if (showNotification) {
      const { headline, message } =
        getMediaErrorNotificationContent(hasAudioInputDevices, hasVideoInputDevices, props.error);
      notification.error({ message: headline, description: message });
    }
  }, [ showNotification ]);

  return <></>;
};
export default MediaErrorNotification;
