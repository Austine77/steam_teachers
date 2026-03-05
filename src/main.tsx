import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Global styles
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/app.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found. Check index.html for <div id='root'></div>.");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
