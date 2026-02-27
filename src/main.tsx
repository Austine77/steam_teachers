import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/app.css";

// Create root safely (better DX in strict TS mode)
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check index.html for <div id='root'></div>");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Router is already inside App.tsx (HashRouter) */}
    <App />
  </React.StrictMode>
);