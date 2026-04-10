/**
 * Login Page Component - Modern Design
 * 
 * This component renders a modern login page with:
 * - Animated gradient background
 * - Swasthya Sathi branding
 * - No static images (converted to animations)
 * - Bold colors and modern styling
 * - Full-page coverage
 */

import React, { useEffect } from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "./../../components/shared/Spinner";
import { toast } from "react-toastify";
import "./Auth.css";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  
  // Show error only if there's a real error
  useEffect(() => {
    if (error && error.trim() !== "") {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [error]);
  
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="auth-page">
          {/* Animated Background */}
          <div className="auth-animated-bg">
            <div className="animated-circle circle-1"></div>
            <div className="animated-circle circle-2"></div>
            <div className="animated-circle circle-3"></div>
            <div className="animated-shape shape-1"></div>
            <div className="animated-shape shape-2"></div>
          </div>

          {/* Main Content Container */}
          <div className="auth-container">
            {/* Left Side - Animated Branding Section */}
            <div className="auth-branding-section">
              {/* Animated Logo */}
              <div className="branding-animated-header">
                <div className="animated-icon icon-1">💉</div>
                <div className="animated-icon icon-2">🏥</div>
                <div className="animated-icon icon-3">❤️</div>
              </div>

              {/* Brand Text */}
              <div className="branding-content">
                <h2 className="branding-title">Swasthya Sathi</h2>
                <p className="branding-subtitle">
                  Your Trusted Health Management Partner
                </p>
                
                {/* Feature List with Animations */}
                <div className="branding-features">
                  <div className="feature-item animate-slide-in-left">
                    <span className="feature-icon">🔒</span>
                    <span className="feature-text">Bank-Level Security</span>
                  </div>
                  <div className="feature-item animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                    <span className="feature-icon">⚡</span>
                    <span className="feature-text">Real-Time Updates</span>
                  </div>
                  <div className="feature-item animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                    <span className="feature-icon">🤖</span>
                    <span className="feature-text">AI-Powered Insights</span>
                  </div>
                  <div className="feature-item animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                    <span className="feature-icon">🏥</span>
                    <span className="feature-text">Hospital Integrated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="auth-form-section">
              <div className="form-wrapper">
                <Form
                  formTitle={"Welcome Back"}
                  submitBtn={"Login"}
                  formType={"login"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;


