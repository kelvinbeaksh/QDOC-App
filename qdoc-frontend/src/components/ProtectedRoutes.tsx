import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UserRoles } from "../clients/auth-client";
import { User, getUserId } from "../contexts/user-context";

interface ProtectedRouteProps extends RouteProps {
  component: any,
  isAuthenticated: boolean,
  redirectToIfNotAuthenticated: string
  redirectToIfNotAuthorized?: string
  userRole?: UserRoles
  user?: User
  requiredRoles?: UserRoles[]
}
const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  redirectToIfNotAuthenticated,
  redirectToIfNotAuthorized,
  userRole,
  user,
  requiredRoles,
  ...rest
}: ProtectedRouteProps): React.ReactElement => (
  <Route
    {...rest}
    render={(props) => {
      if (!isAuthenticated) {
        return <Redirect to={redirectToIfNotAuthenticated} />;
      }
      if (!requiredRoles && isAuthenticated) {
        return <Component {...props} userId={getUserId(user)}/>;
      }
      if (requiredRoles && requiredRoles.includes(userRole)) {
        return <Component {...props} userId={getUserId(user)}/>;
      }
      return <Redirect to={redirectToIfNotAuthorized} />;
    }
    }
  />
);

export default ProtectedRoute;
