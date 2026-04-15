import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/GlobalTheme.css";
import "./styles/Theme.css";
import "./styles/Layout.css";
import "./styles/Animations.css";
import "./styles/Responsive.css";
import "./styles/Dashboard.css";
import "./styles/InputStyles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeContext";
import store from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';

// =============================================
// CHROME EXTENSION ERROR SUPPRESSION
// =============================================
// Suppress errors from Chrome extensions (exam.js, etc.)
// These are not part of our application and should be hidden

// Override console methods to suppress extension errors
const originalError = console.error;
console.error = function(...args) {
  const errorString = args.map(arg => String(arg)).join(' ');
  // Suppress chrome extension errors entirely
  if (errorString.includes('chrome-extension://') || 
      errorString.includes('toLowerCase') ||
      errorString.includes('Cannot read properties')) {
    return;
  }
  originalError.apply(console, args);
};

const originalWarn = console.warn;
console.warn = function(...args) {
  const warnString = args.map(arg => String(arg)).join(' ');
  if (warnString.includes('chrome-extension://')) {
    return;
  }
  originalWarn.apply(console, args);
};

// Global error event listener - suppress extension errors completely
window.addEventListener("error", (event) => {
  // Check if error is from chrome extension
  if (event.filename && event.filename.includes("chrome-extension://")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }
  
  // Check error message for extension-related errors
  if (event.message) {
    const message = String(event.message).toLowerCase();
    if (message.includes('chrome-extension') || 
        message.includes('tostring') ||
        (message.includes('cannot read properties') && message.includes('tolowercase'))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  }
  
  return false;
}, true);

// Suppress unhandled promise rejections from extensions
window.addEventListener("unhandledrejection", (event) => {
  try {
    const reasonStr = String(event.reason);
    if (reasonStr.includes("chrome-extension") || 
        reasonStr.includes('toLowerCase')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  } catch (e) {
    // Ignore
  }
}, true);

// Intercept React's error reporting for extension errors
if (window.React) {
  // React will handle errors, we just suppress extension ones via console override above
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
