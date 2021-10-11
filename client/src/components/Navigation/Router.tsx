import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { BoardPage } from "../../pages/BoardPage";
import { BoardsOverviewPage } from "../../pages/BoardsOverviewPage";
import { LandingPage } from "../../pages/LandingPage";
import { RegisterPage } from "../../pages/RegisterPage";
import { AuthRoute } from "./AuthRoute";

interface RouterProps {}

export const Router: React.FC<RouterProps> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <AuthRoute path="/boards" component={BoardsOverviewPage} exact />
        <AuthRoute path="/b/:id" component={BoardPage} exact />
        <Route path="/" component={LandingPage} exact />
        <Route path="/register" component={RegisterPage} exact />
      </Switch>
    </BrowserRouter>
  );
};
