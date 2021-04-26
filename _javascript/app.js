import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes.js";

//TODO allow query params in the router url
export default () => (
  <Switch>
    {routes.map((route) => (
      <Route {...route} />
    ))}
  </Switch>
);
