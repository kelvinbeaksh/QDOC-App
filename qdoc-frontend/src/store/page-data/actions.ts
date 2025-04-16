import {
  SET_PAGE_DATA,
  UPDATE_PAGE_DATA,
  RESET_PAGE_DATA,
  SetPageDataAction,
  ResetPageDataAction,
  UpdatePageDataAction
} from "./types";

import { IPageData } from "../../interfaces/page";

export const setPageData = (data: IPageData): SetPageDataAction => ({
  type: SET_PAGE_DATA,
  payload: data
});

export const updatePageData = (data: IPageData): UpdatePageDataAction => ({
  type: UPDATE_PAGE_DATA,
  payload: data
});

export const resetPageData = (): ResetPageDataAction => ({
  type: RESET_PAGE_DATA
});
