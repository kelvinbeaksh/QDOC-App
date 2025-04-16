import { IPageData } from "../../interfaces/page";

export const SET_PAGE_DATA = "[base Page] Set";
export const RESET_PAGE_DATA = "[base PAge] Reset";
export const UPDATE_PAGE_DATA = "[base Page] Update";

export interface SetPageDataAction {
  type: typeof SET_PAGE_DATA;
  payload: IPageData;
}

export interface ResetPageDataAction {
  type: typeof RESET_PAGE_DATA;
}

export interface UpdatePageDataAction {
  type: typeof UPDATE_PAGE_DATA;
  payload: IPageData;
}

export type PageActionsTypes = SetPageDataAction | ResetPageDataAction | UpdatePageDataAction;
