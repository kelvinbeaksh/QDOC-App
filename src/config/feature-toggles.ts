import { get } from "lodash";

const VALIDATE_FIREBASE_CONFIG = (): boolean => {
  return get(window, "__ENV.REACT_APP_VALIDATE_FIREBASE_CONFIG", "false") === "true";
};

const featureToggles = {
  VALIDATE_FIREBASE_CONFIG
};

export default featureToggles;
