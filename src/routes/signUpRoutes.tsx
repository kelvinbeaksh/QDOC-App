import React from "react";
import { Route } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import { UserRoles } from "../clients/auth-client";

const signUpRoutes = () => {
  return [
    <Route path='/sign-up'
      key='patient-sign-up'
      exact
      render={(props) =>
        <SignUpPage {...props} role={UserRoles.PATIENT} />}
    />,
    <Route path='/admins/sign-up'
      exact
      key='admin-sign-up'
      render={(props) =>
        <SignUpPage {...props} role={UserRoles.ADMIN} />}
    />,
    <Route path='/doctors/sign-up'
      exact
      key='doctor-sign-up'
      render={(props) =>
        <SignUpPage {...props} role={UserRoles.DOCTOR} />}
    /> ];
};

export default signUpRoutes;
