import { SET_USER_DATA } from "./types";
import { UserContextState } from "../../contexts/user-context";

export const setUser = (data: UserContextState): object => ({
  type: SET_USER_DATA,
  payload: data
});
