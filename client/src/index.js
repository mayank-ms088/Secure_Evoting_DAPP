import React from "react";

import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "./assets/scss/material-kit-react.scss";
import "nprogress/nprogress.css";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { configureStore } from "store";
import { Provider } from "react-redux";
// enableES5();

require("dotenv").config();
function Wrap({ children }) {
  const store = configureStore();
  return <Provider store={store}>{children}</Provider>;
}

ReactDOM.render(
  <Wrap>
    <App />
  </Wrap>,
  document.getElementById("root")
);

serviceWorker.register();
