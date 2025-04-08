import React, { createContext, useContext, useReducer, useState } from "react";
import { TwilioError } from "twilio-video";
import { RoomType } from "../types/twilio";
import firebase from "firebase";
import useActiveSinkId from "../hooks/videos/useActiveSinkId/useActiveSinkId";
import { initialSettings, Settings, SettingsAction, settingsReducer } from "./settings/settingsReducer";
import VideoService from "../services/video-service";

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  getToken(name: string, room: string, passcode?: string): Promise<{ room_type: RoomType; token: string }>;
  user?: firebase.User | null | { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  isAuthReady?: boolean;
  isFetching: boolean;
  roomType?: RoomType;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [ error, setError ] = useState<TwilioError | null>(null);
  const [ isFetching, setIsFetching ] = useState(false);
  const [ roomType, setRoomType ] = useState<RoomType>();
  const [ settings, dispatchSetting ] = useReducer(settingsReducer, initialSettings);
  const [ activeSinkId, setActiveSinkId ] = useActiveSinkId();

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    roomType
  } as StateContextType;

  contextValue = {
    ...contextValue,
    getToken: async (userIdentity, roomName) => {
      try {
        const videoToken = await VideoService.generateVideoToken(roomName, userIdentity);
        return { token: videoToken.token, room_type: "group-small" };
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  };

  const getToken: StateContextType["getToken"] = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then(res => {
        setRoomType(res.room_type);
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        // eslint-disable-next-line promise/no-return-wrap
        return Promise.reject(err);
      });
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken }}>
      {props.children}
    </StateContext.Provider>
  );
}

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within the AppStateProvider");
  }
  return context;
};
