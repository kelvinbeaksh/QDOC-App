import React, { ReactElement } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import { useHideLoader } from "./hooks/useHideLoader";
import NotFound from "./pages/sessions/404";
import InternalError from "./pages/sessions/500";
import SignInPage from "./pages/SignInPage";
import { UserContextProvider, useUserContext } from "./contexts/user-context";
import UnAuthorizedErrorPage from "./pages/sessions/UnAuthorizedErrorPage";
import Header from "./layout/components/header/Header";
import Sider from "./layout/sider/Sider";
import MainLayout from "./layout/main/MainLayout";
import mainRoutes from "./routes/mainRoutes";
import signUpRoutes from "./routes/signUpRoutes";
import videoRoutes from "./routes/videoRoutes";
import VideoLayout from "./layout/video/VideoLayout";
import { Helmet } from "react-helmet";

const App = (): ReactElement => {
  useHideLoader();
  const { isAuthenticated, user } = useUserContext();

  return (
    <>
      <Helmet>
        <meta name="google" content="notranslate"/>
      </Helmet>

      <Switch>
        <Route path='/not-found' exact component={NotFound} />
        <Route path='/internal-error' exact component={InternalError} />
        <Route path='/unauthorized' exact component={UnAuthorizedErrorPage} />
        <Route path='/sign-in' exact component={SignInPage} />

        {signUpRoutes()}

        <Route exact path={["/telemed/:room"]}>
          <VideoLayout>{videoRoutes(user, isAuthenticated)}</VideoLayout>
        </Route>

        <Route
          exact
          path={[
            "/",
            "/new-layout",
            "/clinics",
            "/clinics/:clinicId",
            "/tickets/:ticketId",
            "/clinics/:clinicId/queues",
            "/clinics/:clinicId/queues/:queueId",
            "/clinics/:clinicId/tickets",
            "/clinics/:clinicId/appointments",
            "/doctors/:doctorId",
            "/patients/:patientId"
          ]}
        >

          <MainLayout header={<Header user={user} />} sider={<Sider user={user} />}>
            {mainRoutes(user, isAuthenticated)}
          </MainLayout>
        </Route>

        <Redirect to='/not-found' />
      </Switch>
    </>
  );
};

export const AppProvider = (): ReactElement => {
  return (
    <UserContextProvider>
      <App />
    </UserContextProvider>
  );
};

export default AppProvider;
