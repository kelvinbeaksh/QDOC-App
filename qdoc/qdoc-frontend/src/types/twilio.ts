import { TwilioError } from "twilio-video";

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError | Error) => void;

declare global {
  interface Window {
    visualViewport?: {
      scale: number;
    };
  }

  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }

}

declare module "twilio-video" {
  // These help to create union types between Local and Remote VideoTracks
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }
}

export type RoomType = "group" | "group-small" | "peer-to-peer" | "go";

export type RecordingRule = {
  type: "include" | "exclude";
  all?: boolean;
  kind?: "audio" | "video";
  publisher?: string;
};

export type RecordingRules = RecordingRule[];

export interface DeviceInfo {
  audioInputDevices: MediaDeviceInfo[]
  videoInputDevices:MediaDeviceInfo[]
  audioOutputDevices: MediaDeviceInfo[]
  hasAudioInputDevices: boolean
  hasVideoInputDevices: boolean
}
