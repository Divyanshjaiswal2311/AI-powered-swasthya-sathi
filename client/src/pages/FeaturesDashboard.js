import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/shared/Layout/Layout";
import "./FeaturesDashboard.css";
import { FaHeartbeat, FaBrain, FaFileAlt, FaExclamationTriangle, FaTint, FaChartLine } from "react-icons/fa";

const FeaturesDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "🏥 Health Profile",
      description: "Manage your complete health information, medical history, allergies, and medications",
      icon: <FaHeartbeat className="feature-icon" />,
      path: "/health-profile",
      color: "#ff6b6b",
      stats: "Your health data"
    },
    {
      id: 2,
      title: "🤖 AI Health Assistant",
      description: "Get AI-powered health reports, first aid recommendations, and 24/7 health chatbot support",
      icon: <FaBrain className="feature-icon" />,
      path: "/ai-health-chat",
      color: "#4ecdc4",
      stats: "Powered by GPT-4"
    },
    {
      id: 3,
      title: "📋 Medical Records",
      description: "Securely store, manage, and share your medical documents and reports",
      icon: <FaFileAlt className="feature-icon" />,
      path: "/medical-records",
      color: "#95e1d3",
      stats: "Secure storage"
    },
    {
      id: 4,
      title: "🚨 Emergency Alert",
      description: "One-tap emergency activation with real-time responder coordination and blood bank coordination",
      icon: <FaExclamationTriangle className="feature-icon" />,
      path: "/emergency-alert",
      color: "#f38181",
      stats: "Instant help"
    },
    {
      id: 5,
      title: "💓 Health Metrics",
      description: "Track vital signs, blood pressure, heart rate, and monitor health trends over time",
      icon: <FaTint className="feature-icon" />,
      path: "/health-metrics",
      color: "#e74c3c",
      stats: "Real-time tracking"
    },
    {
      id: 6,
      title: "📊 Analytics Dashboard",
      description: "View comprehensive health analytics, trends, and personalized insights",
      icon: <FaChartLine className="feature-icon" />,
      path: "/analytics",
      color: "#3498db",
      stats: "Data-driven insights"
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <Layout>
      <div className="features-dashboard">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Your Health Ecosystem</h1>
            <p className="hero-subtitle">Complete health management powered by AI</p>
            {user && <p className="user-greeting">Hello, {user?.name || user?.email}! 👋</p>}
          </div>
        </div>

        {/* Main Content */}
        <div className="features-container">
          <div className="section-header">
            <h2>Your Health Features</h2>
            <p className="section-subtitle">Explore all available health management tools</p>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="feature-card"
                onClick={() => handleFeatureClick(feature.path)}
                style={{ borderTopColor: feature.color }}
              >
                <div className="feature-header" style={{ backgroundColor: `${feature.color}15` }}>
                  <div className="feature-icon-container" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <span className="feature-stat-badge">{feature.stats}</span>
                </div>
                <div className="feature-body">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button
                    className="feature-btn"
                    style={{
                      backgroundColor: feature.color,
                      borderColor: feature.color
                    }}
                  >
                    Open Feature →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats Section */}
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h4>AI Powered</h4>
                <p>GPT-4 Health Intelligence</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔒</div>
              <div className="stat-info">
                <h4>Secure</h4>
                <p>Your data is encrypted & protected</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <h4>Real-Time</h4>
                <p>Instant updates & notifications</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🌍</div>
              <div className="stat-info">
                <h4>Connected</h4>
                <p>Blood bank & emergency networks</p>
              </div>
            </div>
          </div>

          {/* Features Overview Section */}
          <div className="features-overview">
            <div className="overview-section">
              <h3>🏥 Health Profile</h3>
              <div className="overview-content">
                <ul>
                  <li>📝 Complete health history</li>
                  <li>💊 Medication tracking</li>
                  <li>⚠️ Allergy management</li>
                  <li>👨‍⚕️ Condition tracking</li>
                  <li>✅ Donation eligibility scoring</li>
                </ul>
              </div>
            </div>

            <div className="overview-section">
              <h3>🤖 AI Health Features</h3>
              <div className="overview-content">
                <ul>
                  <li>🧠 AI health report generation</li>
                  <li>🆘 First aid recommendations</li>
                  <li>💬 24/7 health chatbot</li>
                  <li>📄 Document analysis</li>
                  <li>⚠️ Risk assessment</li>
                </ul>
              </div>
            </div>

            <div className="overview-section">
              <h3>📋 Medical Records</h3>
              <div className="overview-content">
                <ul>
                  <li>📤 Upload documents safely</li>
                  <li>🔍 AI-powered analysis</li>
                  <li>👨‍⚕️ Doctor collaboration</li>
                  <li>🔐 Secure sharing</li>
                  <li>📚 Complete archival</li>
                </ul>
              </div>
            </div>

            <div className="overview-section">
              <h3>🚨 Emergency System</h3>
              <div className="overview-content">
                <ul>
                  <li>⚡ One-tap alert activation</li>
                  <li>📍 Real-time location sharing</li>
                  <li>🏥 Blood bank coordination</li>
                  <li>👮 Responder tracking</li>
                  <li>📲 Live status updates</li>
                </ul>
              </div>
            </div>

            <div className="overview-section">
              <h3>💓 Health Metrics</h3>
              <div className="overview-content">
                <ul>
                  <li>❤️ Vital signs tracking</li>
                  <li>📈 Trend analysis</li>
                  <li>🚨 Abnormal alerts</li>
                  <li>📊 Historical data</li>
                  <li>⏰ Real-time monitoring</li>
                </ul>
              </div>
            </div>

            <div className="overview-section">
              <h3>📊 Analytics</h3>
              <div className="overview-content">
                <ul>
                  <li>📈 Health trends</li>
                  <li>💡 Personalized insights</li>
                  <li>🎯 Health goals</li>
                  <li>📅 Historical comparison</li>
                  <li>🔔 Smart recommendations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <h3>Ready to Improve Your Health?</h3>
            <p>Start with your health profile and unlock all powerful features</p>
            <button
              className="cta-button"
              onClick={() => navigate("/health-profile")}
            >
              Get Started Now 🚀
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeaturesDashboard;
