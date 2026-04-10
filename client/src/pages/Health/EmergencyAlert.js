/**
 * Emergency Alert Page
 * 
 * One-touch emergency alert system for critical situations
 */

import React, { useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { toast } from "react-toastify";
import "./EmergencyAlert.css";

const EmergencyAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("blood_needed");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    urgencyLevel: "critical",
    hospitalName: "",
    city: "",
    primaryPhone: "",
    bloodRequirements: [],
  });
  const [loading, setLoading] = useState(false);

  const handleEmergencyAlert = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/emergency/create", {
        alertType,
        ...formData,
      });

      if (data.success) {
        toast.success("Emergency alert activated! Responders are being notified.");
        setShowAlert(false);
        resetForm();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating emergency alert");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      urgencyLevel: "critical",
      hospitalName: "",
      city: "",
      primaryPhone: "",
      bloodRequirements: [],
    });
  };

  return (
    <Layout>
      <div className="emergency-alert-page">
        {/* Emergency Button Section */}
        <div className="emergency-button-section">
          <div className="emergency-button-container">
            <button
              className="emergency-btn"
              onClick={() => setShowAlert(true)}
              disabled={showAlert}
            >
              <i className="fas fa-exclamation-circle"></i>
              <span>EMERGENCY</span>
            </button>
            <p className="emergency-btn-text">One-tap emergency alert</p>
          </div>
        </div>

        {/* Emergency Form Modal */}
        {showAlert && (
          <div className="emergency-modal-overlay" onClick={() => setShowAlert(false)}>
            <div className="emergency-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header emergency-modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Emergency Alert
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAlert(false)}
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={handleEmergencyAlert} className="modal-body emergency-form">
                {/* Alert Type */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Emergency Type *</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="alertType"
                      id="blood"
                      value="blood_needed"
                      checked={alertType === "blood_needed"}
                      onChange={(e) => setAlertType(e.target.value)}
                    />
                    <label className="btn btn-outline-danger" htmlFor="blood">
                      <i className="fas fa-droplet me-2"></i>Blood Needed
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="alertType"
                      id="medical"
                      value="medical_emergency"
                      checked={alertType === "medical_emergency"}
                      onChange={(e) => setAlertType(e.target.value)}
                    />
                    <label className="btn btn-outline-danger" htmlFor="medical">
                      <i className="fas fa-heartbeat me-2"></i>Medical Emergency
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Emergency Title *</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g., Severe Car Accident Victim"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Description *</label>
                  <textarea
                    className="form-control"
                    placeholder="Provide detailed information about the emergency..."
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                {/* Urgency Level */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Urgency Level *</label>
                  <select
                    className="form-select form-select-lg"
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                  >
                    <option value="critical">Critical - Immediate</option>
                    <option value="high">High - Within 1 hour</option>
                    <option value="medium">Medium - Within 6 hours</option>
                  </select>
                </div>

                {/* Hospital Information */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Hospital/Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Hospital name or location"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    required
                  />
                </div>

                {/* City */}
                <div className="mb-3">
                  <label className="form-label fw-bold">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Contact Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={formData.primaryPhone}
                    onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                    required
                  />
                </div>

                {/* Blood Requirements (if applicable) */}
                {alertType === "blood_needed" && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Blood Requirements</label>
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <select className="form-select">
                          <option>Select Blood Group</option>
                          <option>O+</option>
                          <option>O-</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-2">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Quantity (ML)"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-danger btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-phone me-2"></i>
                        ACTIVATE EMERGENCY ALERT
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAlert(false)}
                  >
                    Cancel
                  </button>
                </div>

                <div className="alert alert-info mt-3">
                  <small>
                    <i className="fas fa-info-circle me-2"></i>
                    By activating this alert, nearby blood banks, hospitals, and emergency responders
                    will be notified immediately.
                  </small>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="row mt-5">
          <div className="col-md-4 mb-3">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h5>Quick Response</h5>
              <p>Responders are alerted instantly</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h5>Location Sharing</h5>
              <p>Your location is shared with responders</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h5>24/7 Support</h5>
              <p>Continuous monitoring and updates</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyAlert;

