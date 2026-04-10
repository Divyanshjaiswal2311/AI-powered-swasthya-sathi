import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LandingPage.css";
import { FaHeartbeat, FaHospital, FaUsers, FaShieldAlt, FaBrain, FaChartLine } from "react-icons/fa";

const LandingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const features = [
    {
      id: 1,
      icon: <FaHeartbeat />,
      title: "Health Profile",
      description: "Complete health management with medical history, allergies, and condition tracking"
    },
    {
      id: 2,
      icon: <FaBrain />,
      title: "AI Health Assistant",
      description: "24/7 AI-powered health insights, first aid recommendations, and health chatbot"
    },
    {
      id: 3,
      icon: <FaShieldAlt />,
      title: "Medical Records",
      description: "Securely store and manage all medical documents with encrypted storage"
    },
    {
      id: 4,
      icon: <FaUsers />,
      title: "Emergency Coordination",
      description: "One-tap emergency activation with real-time responder tracking"
    },
    {
      id: 5,
      icon: <FaChartLine />,
      title: "Health Analytics",
      description: "Comprehensive health trends, insights, and personalized recommendations"
    },
    {
      id: 6,
      icon: <FaHospital />,
      title: "Hospital Integration",
      description: "Seamless integration with hospitals for blood bank coordination"
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <nav className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="logo-link">
            <FaHeartbeat className="logo-icon" />
            <span className="logo-text">Swasthya Sathi</span>
          </Link>
          <div className="nav-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link register-btn">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Health, <span className="gradient-text">Our Priority</span>
            </h1>
            <p className="hero-subtitle">
              Advanced health management platform with AI-powered insights, medical records management, 
              and seamless hospital integration for comprehensive health coverage.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Health Records</div>
              </div>
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/assets/images/login_image.png" 
              alt="Health Management" 
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Powerful Features for Better Health</h2>
          <p>Everything you need for comprehensive health management</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`feature-item ${activeFeature === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefits-content">
            <h2>Why Choose Swasthya Sathi?</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">🔒</div>
                <div>
                  <h4>Bank-Level Security</h4>
                  <p>Your health data is encrypted with military-grade security</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <div>
                  <h4>Real-Time Updates</h4>
                  <p>Instant access to your health information anytime, anywhere</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🤖</div>
                <div>
                  <h4>AI-Powered Insights</h4>
                  <p>Get personalized health recommendations from AI analysis</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🏥</div>
                <div>
                  <h4>Hospital Connected</h4>
                  <p>Seamlessly share records with hospitals and healthcare providers</p>
                </div>
              </div>
            </div>
          </div>
          <div className="benefits-image">
            <img 
              src="/assets/images/Register_Image.png" 
              alt="Benefits" 
              className="benefits-img"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in 3 simple steps</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up in minutes with your email and basic information</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Build Profile</h3>
            <p>Add your health information and medical history</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Stay Healthy</h3>
            <p>Get AI insights and manage your health effectively</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>Join thousands of users managing their health efficiently</p>
          <Link to="/register" className="btn btn-primary btn-lg btn-cta">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Swasthya Sathi</h4>
            <p>Your trusted health management partner</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@swasthyasathi.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Swasthya Sathi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 