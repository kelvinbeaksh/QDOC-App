import { IRoute } from "../interfaces/routing";

import NotFound from "../pages/sessions/404";
import InternalError from "../pages/sessions/500";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

export const sessionRoutes: IRoute[] = [
  {
    path: "page-404",
    component: NotFound
  },
  {
    path: "page-500",
    component: InternalError
  },
  {
    path: "sign-in",
    component: SignInPage
  },
  {
    path: "sign-up",
    component: SignUpPage
  }
];
