/**
 * Error Boundary Component
 * 
 * Catches React component errors and displays a fallback UI
 * instead of crashing the entire application
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Ignore chrome extension errors
    if (error && error.toString && error.toString().includes('chrome-extension')) {
      return { hasError: false, error: null };
    }
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Ignore errors from Chrome extensions completely
    if (error && error.toString && error.toString().includes('chrome-extension')) {
      this.setState({ hasError: false });
      return;
    }
    
    if (errorInfo && errorInfo.componentStack && errorInfo.componentStack.includes('chrome-extension')) {
      this.setState({ hasError: false });
      return;
    }
    
    // Log legitimate app errors for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
              Oops! Something went wrong
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              The application encountered an error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

