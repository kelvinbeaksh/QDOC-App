import React from "react";
import ProtectedRoute from "../components/ProtectedRoutes";
import { User } from "../contexts/user-context";
import VideoAppWithState from "../components/Video/VideoAppWithState";

const videoRoutes = (user: User, isAuthenticated: boolean) => {
  return [
    <ProtectedRoute path='/telemed/:room' exact
      key='telemed'
      userRole={user.role}
      user={user}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
      component={VideoAppWithState}
    />
  ];
};

export default videoRoutes;
