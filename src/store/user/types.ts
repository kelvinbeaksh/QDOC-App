import { UserContextState } from "../../contexts/user-context";

export const SET_USER_DATA = "[USER] Set";

export interface SetUserDataAction {
  type: typeof SET_USER_DATA;
  payload: UserContextState;
}
export type PageActionsTypes = SetUserDataAction;
