import { useEffect, useState } from "react";
import useVideoContext from "../../../contexts/video-context";

type RoomStateType = "disconnected" | "connected" | "reconnecting";

const useRoomState = () => {
  const { room } = useVideoContext();
  const [ state, setState ] = useState<RoomStateType>("disconnected");

  useEffect((): () => void => {
    if (room) {
      const setRoomState = () => setState(room.state as RoomStateType);
      setRoomState();
      room
        .on("disconnected", setRoomState)
        .on("reconnected", setRoomState)
        .on("reconnecting", setRoomState);
      return () => {
        room
          .off("disconnected", setRoomState)
          .off("reconnected", setRoomState)
          .off("reconnecting", setRoomState);
      };
    }
    return () => {};
  }, [ room ]);

  return state;
};

export default useRoomState;
