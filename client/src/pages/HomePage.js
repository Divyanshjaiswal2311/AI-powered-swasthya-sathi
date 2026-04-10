import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import "./HomePage.css";
import { FaHeartbeat, FaBrain, FaShieldAlt, FaUsers, FaChartLine, FaHospital, FaArrowRight } from "react-icons/fa";

const HomePage = () => {
  const { loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(0);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
      return;
    }
    // Home page will show if user is not admin
  }, [user, navigate]);

  const features = [
    {
      id: 1,
      icon: <FaHeartbeat />,
      title: "Health Profile",
      description: "Manage your complete health information",
      path: "/health-profile",
      color: "#ef4444"
    },
    {
      id: 2,
      icon: <FaBrain />,
      title: "AI Assistant",
      description: "Get AI-powered health insights 24/7",
      path: "/ai-health-chat",
      color: "#3b82f6"
    },
    {
      id: 3,
      icon: <FaShieldAlt />,
      title: "Medical Records",
      description: "Secure medical document storage",
      path: "/medical-records",
      color: "#10b981"
    },
    {
      id: 4,
      icon: <FaUsers />,
      title: "Emergency Alert",
      description: "One-tap emergency activation",
      path: "/emergency-alert",
      color: "#f59e0b"
    },
    {
      id: 5,
      icon: <FaChartLine />,
      title: "Health Metrics",
      description: "Track vital signs and trends",
      path: "/health-metrics",
      color: "#8b5cf6"
    },
    {
      id: 6,
      icon: <FaHospital />,
      title: "Analytics",
      description: "View health analytics and insights",
      path: "/analytics",
      color: "#ec4899"
    }
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <Layout>
      <div className="home-page">
        {/* Welcome Hero */}
        <section className="welcome-hero">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1 className="welcome-title">
                Welcome back, <span className="user-name">{user?.name || user?.email}</span>! 👋
              </h1>
              <p className="welcome-subtitle">
                Your personalized health management hub is ready to serve you
              </p>
              <div className="welcome-stats">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-details">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Health Records</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-details">
                    <div className="stat-value">72</div>
                    <div className="stat-label">Avg. Heart Rate</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💪</div>
                  <div className="stat-details">
                    <div className="stat-value">95%</div>
                    <div className="stat-label">Health Score</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="welcome-image">
              <img 
                src="/assets/images/login_image.png" 
                alt="Welcome" 
                className="welcome-img"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="section-header">
            <h2>Quick Access</h2>
            <p>Access your health features in seconds</p>
          </div>

          <div className="actions-grid">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className={`action-card ${selectedFeature === index ? 'active' : ''}`}
                style={{ borderTopColor: feature.color }}
                onMouseEnter={() => setSelectedFeature(index)}
                onClick={() => navigate(feature.path)}
              >
                <div className="action-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="action-btn" style={{ backgroundColor: feature.color }}>
                  Open <FaArrowRight style={{ marginLeft: '8px' }} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <div className="activity-container">
            <div className="activity-header">
              <h2>Recent Activity</h2>
              <span className="view-all">View all</span>
            </div>

            <div className="activity-items">
              <div className="activity-item">
                <div className="activity-icon">📊</div>
                <div className="activity-content">
                  <h4>Health Profile Updated</h4>
                  <p>You updated your health information</p>
                  <span className="activity-time">Today at 10:30 AM</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📁</div>
                <div className="activity-content">
                  <h4>New Medical Record Uploaded</h4>
                  <p>Lab report from Hospital XYZ</p>
                  <span className="activity-time">Yesterday at 2:15 PM</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">💬</div>
                <div className="activity-content">
                  <h4>AI Health Insight Generated</h4>
                  <p>Your monthly health summary is ready</p>
                  <span className="activity-time">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Tips */}
        <section className="health-tips">
          <div className="section-header">
            <h2>Health Tips</h2>
            <p>Daily wellness recommendations</p>
          </div>

          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💧</div>
              <h3>Stay Hydrated</h3>
              <p>Drink at least 8 glasses of water daily for optimal health</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🚴</div>
              <h3>Exercise Daily</h3>
              <p>30 minutes of physical activity helps maintain good health</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">😴</div>
              <h3>Get Quality Sleep</h3>
              <p>7-8 hours of sleep is essential for body recovery</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🥗</div>
              <h3>Eat Healthy</h3>
              <p>Balance your diet with fruits, vegetables, and proteins</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
