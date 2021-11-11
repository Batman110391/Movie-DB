import React from "react";
import ReactDOM from "react-dom";
import "./css/index.scss";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
