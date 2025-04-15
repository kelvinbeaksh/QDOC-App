import { get } from "lodash";
import validate from "validate.js";
import featureToggles from "./feature-toggles";

export interface FirebaseConfig {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
  measurementId: string,
}

class Config {
  public static get apiBaseUrl(): string {
    return get(window, "__ENV.REACT_APP_API_BASE_URL", "");
  }

  public static get appBaseUrl(): string {
    return get(window, "__ENV.REACT_APP_BASE_URL", "");
  }

  public static get firebaseEmulatorUrl(): string {
    return get(window, "__ENV.REACT_APP_FIREBASE_EMULATOR_URL", "");
  }

  public static get isUsingFirebaseEmulator(): boolean {
    return this.nodeEnvironment === "local" && !!this.firebaseEmulatorUrl;
  }

  public static get nodeEnvironment(): string {
    return get(window, "__ENV.REACT_APP_NODE_ENV", "local");
  }

  public static get zoomSdkKey(): string {
    return get(window, "__ENV.REACT_APP_ZOOM_SDK_KEY", "zoomSdkKey");
  }

  public static get zoomSdkSecret(): string {
    return get(window, "__ENV.REACT_APP_ZOOM_SDK_SECRET", "zoomSdkSecret");
  }

  public static get twilioAccountSid(): string {
    return get(window, "__ENV.REACT_APP_TWILIO_ACCOUNT_SID", "twilioAccountSid");
  }

  public static get twilioAccountToken(): string {
    return get(window, "__ENV.REACT_APP_TWILIO_ACCOUNT_TOKEN", "twilioAccountToken");
  }

  public static get twilioVerifyServiceSid(): string {
    return get(window, "__ENV.REACT_APP_TWILIO_VERIFY_SERVICE_SID", "twilioVerifyServiceSid");
  }

  private static firebaseConfigConstraints = {
    apiKey: { presence: true },
    authDomain: { presence: true },
    projectId: { presence: true },
    storageBucket: { presence: true },
    messagingSenderId: { presence: true },
    appId: { presence: true },
    measurementId: { presence: true }
  };

  public static get firebaseConfig(): FirebaseConfig | null {
    const firebaseConfigString = get(window, "__ENV.REACT_APP_FIREBASE_CONFIG", "{}");
    const configMap = JSON.parse(firebaseConfigString);
    if (featureToggles.VALIDATE_FIREBASE_CONFIG() && this.validConfig(configMap, this.firebaseConfigConstraints)) {
      return configMap;
    }
    return null;
  }

  private static validConfig(config: any, constraints): boolean {
    const validationResult = validate(config, constraints);
    if (validationResult !== undefined) {
      throw Error(`Invalid firebase config: ${JSON.stringify(validationResult)}`);
    }
    return true;
  }
}

export default Config;
