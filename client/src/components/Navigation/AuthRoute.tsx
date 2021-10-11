import React, { useContext, useEffect, useState } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { UserActions } from "../../actions/UserActions";
import { AppContext } from "../../contexts/AppContext";
import { LoadingPage } from "../../pages/LoadingPage";

interface AuthRouteProps extends RouteProps {}

export const AuthRoute: React.FC<AuthRouteProps> = ({ component, ...rest }) => {
  const [hasRunAuthCheck, setHasRunAuthCheck] = useState(false);
  const {
    state: { user },
  } = useContext(AppContext);
  const { me } = UserActions();

  useEffect(() => {
    (async () => {
      if (!user.authenticated) {
        await me();
        setHasRunAuthCheck(true);
      }
    })();
  }, [me, user.authenticated]);

  if (!user.authenticated && !hasRunAuthCheck) {
    return <Route component={LoadingPage} />;
  }

  if (!user.authenticated) {
    return <Redirect to={{ pathname: "/register" }} />;
  }
  return <Route {...rest} component={component} />;
};
