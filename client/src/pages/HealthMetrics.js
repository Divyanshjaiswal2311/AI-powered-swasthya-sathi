import React, { useState } from "react";
import Layout from "../components/shared/Layout/Layout";
import "./HealthMetrics.css";
import { FaHeartbeat, FaLungs, FaThermometerHalf, FaWeight, FaChartLine } from "react-icons/fa";

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    weight: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [metricsHistory, setMetricsHistory] = useState([
    {
      id: 1,
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
      weight: 70,
      date: "2026-04-10",
      status: "normal"
    },
    {
      id: 2,
      heartRate: 68,
      bloodPressure: "118/78",
      temperature: 98.5,
      weight: 70,
      date: "2026-04-09",
      status: "normal"
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetrics({
      ...metrics,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMetric = {
      id: metricsHistory.length + 1,
      ...metrics,
      heartRate: parseInt(metrics.heartRate),
      temperature: parseFloat(metrics.temperature),
      weight: parseFloat(metrics.weight),
      status: "normal"
    };
    setMetricsHistory([newMetric, ...metricsHistory]);
    setMetrics({
      heartRate: "",
      bloodPressure: "",
      temperature: "",
      weight: "",
      date: new Date().toISOString().split("T")[0]
    });
  };

  const getStatusColor = (type, value) => {
    if (type === "heartRate") {
      if (value < 60) return "low";
      if (value > 100) return "high";
      return "normal";
    }
    if (type === "temperature") {
      if (value < 98) return "low";
      if (value > 99) return "high";
      return "normal";
    }
    return "normal";
  };

  return (
    <Layout>
      <div className="health-metrics">
        <div className="metrics-header">
          <h1>💓 Health Metrics Tracker</h1>
          <p>Monitor your vital signs and health indicators in real-time</p>
        </div>

        <div className="metrics-content">
          {/* Input Section */}
          <div className="metrics-form-section">
            <div className="form-container">
              <h2>📊 Record New Metrics</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FaHeartbeat className="metric-icon" />
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      name="heartRate"
                      value={metrics.heartRate}
                      onChange={handleInputChange}
                      placeholder="e.g., 72"
                      required
                      min="0"
                      max="200"
                    />
                    <small>Normal: 60-100 bpm</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FaLungs className="metric-icon" />
                      Blood Pressure
                    </label>
                    <input
                      type="text"
                      name="bloodPressure"
                      value={metrics.bloodPressure}
                      onChange={handleInputChange}
                      placeholder="e.g., 120/80"
                      required
                    />
                    <small>Format: Systolic/Diastolic</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FaThermometerHalf className="metric-icon" />
                      Temperature (°F)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={metrics.temperature}
                      onChange={handleInputChange}
                      placeholder="e.g., 98.6"
                      required
                      step="0.1"
                      min="95"
                      max="105"
                    />
                    <small>Normal: 98.6°F</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FaWeight className="metric-icon" />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={metrics.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 70"
                      required
                      step="0.1"
                      min="20"
                      max="300"
                    />
                    <small>Your body weight</small>
                  </div>

                  <div className="form-group">
                    <label>📅 Date & Time</label>
                    <input
                      type="date"
                      name="date"
                      value={metrics.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  💾 Save Metrics
                </button>
              </form>
            </div>

            {/* Quick Stats Cards */}
            <div className="quick-stats">
              <div className="stat-card normal">
                <FaHeartbeat className="stat-icon" />
                <h3>Heart Rate</h3>
                <p className="stat-range">60-100 bpm</p>
              </div>
              <div className="stat-card normal">
                <FaLungs className="stat-icon" />
                <h3>Blood Pressure</h3>
                <p className="stat-range">120/80 mmHg</p>
              </div>
              <div className="stat-card normal">
                <FaThermometerHalf className="stat-icon" />
                <h3>Temperature</h3>
                <p className="stat-range">98.6°F</p>
              </div>
              <div className="stat-card normal">
                <FaWeight className="stat-icon" />
                <h3>Weight</h3>
                <p className="stat-range">Monitor daily</p>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="metrics-history-section">
            <h2>📈 Health Metrics History</h2>
            <div className="history-cards">
              {metricsHistory.map((metric) => (
                <div key={metric.id} className="history-card">
                  <div className="history-header">
                    <span className="metric-date">{metric.date}</span>
                    <span className={`status-badge ${metric.status}`}>{metric.status.toUpperCase()}</span>
                  </div>

                  <div className="history-metrics">
                    <div className={`metric-item ${getStatusColor('heartRate', metric.heartRate)}`}>
                      <div className="metric-label">Heart Rate</div>
                      <div className="metric-value">{metric.heartRate} <span>bpm</span></div>
                      {metric.heartRate < 60 && <div className="alert-text">⚠️ Low</div>}
                      {metric.heartRate > 100 && <div className="alert-text">⚠️ High</div>}
                    </div>

                    <div className="metric-item normal">
                      <div className="metric-label">Blood Pressure</div>
                      <div className="metric-value">{metric.bloodPressure} <span>mmHg</span></div>
                    </div>

                    <div className={`metric-item ${getStatusColor('temperature', metric.temperature)}`}>
                      <div className="metric-label">Temperature</div>
                      <div className="metric-value">{metric.temperature} <span>°F</span></div>
                      {metric.temperature < 98 && <div className="alert-text">⚠️ Low</div>}
                      {metric.temperature > 99 && <div className="alert-text">⚠️ High</div>}
                    </div>

                    <div className="metric-item normal">
                      <div className="metric-label">Weight</div>
                      <div className="metric-value">{metric.weight} <span>kg</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {metricsHistory.length === 0 && (
              <div className="empty-state">
                <p>No metrics recorded yet. Start by adding your first measurement!</p>
              </div>
            )}
          </div>

          {/* Insights Section */}
          <div className="insights-section">
            <h2>💡 Health Insights</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <FaChartLine className="insight-icon" />
                <h3>Trend Analysis</h3>
                <p>Your metrics are showing a stable trend. Keep up the good work!</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <h3>Daily Goals</h3>
                <p>Maintain heart rate between 60-100 bpm for optimal health.</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">⚡</div>
                <h3>Recommendations</h3>
                <p>Continue regular exercise and maintain a healthy diet.</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🔔</div>
                <h3>Alerts</h3>
                <p>You'll receive notifications if any metric goes out of normal range.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthMetrics;

