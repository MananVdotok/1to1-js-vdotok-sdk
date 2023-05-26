import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import My from "./My";

const root = createRoot(document.getElementById("app"));

root.render(
  // <React.StrictMode>
  <App />
  // <My />
  // </React.StrictMode>
);
