import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/Theme.css";
import "./styles/Layout.css";
import "./styles/Animations.css";
import "./styles/Responsive.css";
import "./styles/Dashboard.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';

// =============================================
// AGGRESSIVE CHROME EXTENSION ERROR SUPPRESSION
// =============================================

// Suppress console.error from chrome extensions
const originalError = console.error;
console.error = function(...args) {
  const errorString = args.map(arg => String(arg)).join(' ');
  if (errorString.includes('chrome-extension://')) {
    return; // Don't log extension errors at all
  }
  originalError.apply(console, args);
};

// Suppress console.warn from chrome extensions
const originalWarn = console.warn;
console.warn = function(...args) {
  const warnString = args.map(arg => String(arg)).join(' ');
  if (warnString.includes('chrome-extension://')) {
    return; // Don't log extension warnings
  }
  originalWarn.apply(console, args);
};

// Global error handler - catch and suppress extension errors
window.addEventListener("error", (event) => {
  if (event.filename && event.filename.includes("chrome-extension://")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }
  if (event.message && event.message.includes("chrome-extension")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }
  return false;
}, true);

// Suppress unhandled promise rejections from extensions
window.addEventListener("unhandledrejection", (event) => {
  try {
    const reasonStr = String(event.reason);
    if (reasonStr.includes("chrome-extension") || 
        (event.reason && event.reason.message && event.reason.message.includes("chrome-extension"))) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  } catch (e) {
    // Ignore
  }
}, true);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
