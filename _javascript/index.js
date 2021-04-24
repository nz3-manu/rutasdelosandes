import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import reducer from "./reducers";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FAFAFA",
      contrastText: "#000",
    },
  },
});

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__preloaded__;
// Allow the passed state to be garbage-collected
delete window.__preloaded__;

// Create Redux store with initial state
const store = createStore(reducer, preloadedState, applyMiddleware(ReduxThunk));

Sentry.init({
  dsn: "https://55b714e61c0847f8ac639fa047c77fa9@sentry.io/214818",
  integrations: (integrations) => {
    // integrations will be all default integrations
    return integrations.filter(
      (integration) => integration.name !== "Breadcrumbs"
    );
  },
});

ReactDOM.hydrate(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

browserHistory.listen((location) => {
  console.log("page view", location.pathname);
  if (window.gtag) {
    gtag("config", "UA-100391485-2", { page_path: location.pathname });
  }
  if (window.fbq) {
    fbq("track", "PageView");
  }
});

window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault();
  // Stash the event so it can be triggered later.
  window.deferredPrompt = e;
  return false;
});
