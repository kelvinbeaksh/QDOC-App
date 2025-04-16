import isPlainObject from "is-plain-object";
import { DeviceInfo } from "../types/twilio";

export const isMobile = (() => {
  if (typeof navigator === "undefined" || typeof navigator.userAgent !== "string") {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();

// Recursively removes any object keys with a value of undefined
export function removeUndefinedFromObject<T>(obj: T): T {
  if (!isPlainObject(obj)) return obj;

  const target: { [name: string]: any } = {};

  for (const key in obj) {
    if (typeof obj[key] !== "undefined") {
      target[key] = removeUndefinedFromObject(obj[key]);
    }
  }

  return target as T;
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const devices = await navigator.mediaDevices.enumerateDevices();

  return {
    audioInputDevices: devices.filter(device => device.kind === "audioinput"),
    videoInputDevices: devices.filter(device => device.kind === "videoinput"),
    audioOutputDevices: devices.filter(device => device.kind === "audiooutput"),
    hasAudioInputDevices: devices.some(device => device.kind === "audioinput"),
    hasVideoInputDevices: devices.some(device => device.kind === "videoinput")
  };
};

// This function will return 'true' when the specified permission has been denied by the user.
// If the API doesn't exist, or the query function returns an error, 'false' will be returned.
export async function isPermissionDenied(name: PermissionName) {
  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name });
      return result.state === "denied";
    } catch {
      return false;
    }
  } else {
    return false;
  }
}
