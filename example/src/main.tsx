import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const SAMPLE_URL = "https://arxiv.org/pdf/2203.11115";

// Use StrictMode for debugging
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
