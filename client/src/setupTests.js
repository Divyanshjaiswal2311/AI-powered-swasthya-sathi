
import '@testing-library/jest-dom';

// Suppress console errors from chrome extensions
const originalError = console.error;
console.error = function(...args) {
  const message = args.map(arg => String(arg)).join(' ');
  if (message.includes('chrome-extension://')) {
    return;
  }
  originalError.apply(console, args);
};

// Suppress console warnings from chrome extensions
const originalWarn = console.warn;
console.warn = function(...args) {
  const message = args.map(arg => String(arg)).join(' ');
  if (message.includes('chrome-extension://')) {
    return;
  }
  originalWarn.apply(console, args);
};


