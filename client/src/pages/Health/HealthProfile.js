/**
 * Health Profile Page Component
 * 
 * Comprehensive health profile management dashboard
 * for donors and patients
 */

import React, { useState, useEffect } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { toast } from "react-toastify";
import moment from "moment";
import "./HealthProfile.css";

const HealthProfile = () => {
  const [healthProfile, setHealthProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Form states
  const [vitals, setVitals] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
  });

  const [newCondition, setNewCondition] = useState({
    condition: "",
    diagnosedDate: "",
    status: "active",
    severity: "mild",
  });

  const [newAllergy, setNewAllergy] = useState({
    allergen: "",
    severity: "mild",
    reaction: "",
  });

  // Fetch health profile
  useEffect(() => {
    fetchHealthProfile();
  }, []);

  const fetchHealthProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/health/get-profile");
      if (data.success) {
        setHealthProfile(data.healthProfile);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching health profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVitals = async () => {
    try {
      const { data } = await API.post("/health/update-vitals", { vitals });
      if (data.success) {
        setHealthProfile(data.healthProfile);
        setVitals({ systolic: "", diastolic: "", heartRate: "", temperature: "", weight: "", height: "" });
        toast.success("Vitals updated successfully");
      }
    } catch (error) {
      toast.error("Error updating vitals");
    }
  };

  const handleAddCondition = async () => {
    try {
      const { data } = await API.post("/health/add-condition", newCondition);
      if (data.success) {
        setHealthProfile(data.healthProfile);
        setNewCondition({ condition: "", diagnosedDate: "", status: "active", severity: "mild" });
        toast.success("Medical condition added");
      }
    } catch (error) {
      toast.error("Error adding condition");
    }
  };

  const handleAddAllergy = async () => {
    try {
      const { data } = await API.post("/health/add-allergy", newAllergy);
      if (data.success) {
        setHealthProfile(data.healthProfile);
        setNewAllergy({ allergen: "", severity: "mild", reaction: "" });
        toast.success("Allergy added");
      }
    } catch (error) {
      toast.error("Error adding allergy");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="health-profile-container">
        <div className="header-section mb-4">
          <h1 className="text-primary">
            <i className="fas fa-heartbeat me-2"></i>Health Profile
          </h1>
          <p className="text-muted">Manage your comprehensive health information</p>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-chart-line me-2"></i>Overview
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "vitals" ? "active" : ""}`}
              onClick={() => setActiveTab("vitals")}
            >
              <i className="fas fa-heartbeat me-2"></i>Vitals
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "conditions" ? "active" : ""}`}
              onClick={() => setActiveTab("conditions")}
            >
              <i className="fas fa-stethoscope me-2"></i>Conditions
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "allergies" ? "active" : ""}`}
              onClick={() => setActiveTab("allergies")}
            >
              <i className="fas fa-exclamation-triangle me-2"></i>Allergies
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "medications" ? "active" : ""}`}
              onClick={() => setActiveTab("medications")}
            >
              <i className="fas fa-pills me-2"></i>Medications
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && healthProfile && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Basic Information</h5>
                    <p>
                      <strong>Date of Birth:</strong> {moment(healthProfile.dateOfBirth).format("DD/MM/YYYY")}
                    </p>
                    <p>
                      <strong>Gender:</strong> {healthProfile.gender}
                    </p>
                    <p>
                      <strong>Blood Type:</strong>{" "}
                      <span className="badge bg-danger">{healthProfile.bloodType}</span>
                    </p>
                    <p>
                      <strong>BMI:</strong> {healthProfile.vitals?.bmi || "Not recorded"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Quick Stats</h5>
                    <p>
                      <strong>Active Conditions:</strong>{" "}
                      {healthProfile.medicalConditions.filter((c) => c.status === "active").length}
                    </p>
                    <p>
                      <strong>Allergies:</strong> {healthProfile.allergies.length}
                    </p>
                    <p>
                      <strong>Current Medications:</strong> {healthProfile.medications.length}
                    </p>
                    <p>
                      <strong>Donation Eligible:</strong>{" "}
                      {healthProfile.donationEligibility?.isEligible ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-warning">No</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === "vitals" && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Update Vital Signs</h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Systolic (mmHg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={vitals.systolic}
                      onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Diastolic (mmHg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={vitals.diastolic}
                      onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Heart Rate (BPM)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Temperature (°C)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Weight (KG)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Height (CM)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={vitals.height}
                      onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                    />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleUpdateVitals}>
                  <i className="fas fa-save me-2"></i>Save Vitals
                </button>
              </div>
            </div>
          )}

          {/* Conditions Tab */}
          {activeTab === "conditions" && (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Add Medical Condition</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Condition Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Diabetes, Hypertension"
                        value={newCondition.condition}
                        onChange={(e) => setNewCondition({ ...newCondition, condition: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Diagnosed Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newCondition.diagnosedDate}
                        onChange={(e) => setNewCondition({ ...newCondition, diagnosedDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-control"
                        value={newCondition.status}
                        onChange={(e) => setNewCondition({ ...newCondition, status: e.target.value })}
                      >
                        <option value="active">Active</option>
                        <option value="controlled">Controlled</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Severity</label>
                      <select
                        className="form-control"
                        value={newCondition.severity}
                        onChange={(e) => setNewCondition({ ...newCondition, severity: e.target.value })}
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={handleAddCondition}>
                    <i className="fas fa-plus me-2"></i>Add Condition
                  </button>
                </div>
              </div>

              {healthProfile && healthProfile.medicalConditions.length > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Your Conditions</h5>
                    {healthProfile.medicalConditions.map((condition, index) => (
                      <div key={index} className="alert alert-info">
                        <h6>{condition.condition}</h6>
                        <p className="mb-1">
                          <small>Diagnosed: {moment(condition.diagnosedDate).format("DD/MM/YYYY")}</small>
                        </p>
                        <p className="mb-0">
                          <small>
                            Status: <span className="badge bg-secondary">{condition.status}</span> |
                            Severity: <span className="badge bg-warning">{condition.severity}</span>
                          </small>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Allergies Tab */}
          {activeTab === "allergies" && (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Add Allergy</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Allergen</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Penicillin, Peanuts"
                        value={newAllergy.allergen}
                        onChange={(e) => setNewAllergy({ ...newAllergy, allergen: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Severity</label>
                      <select
                        className="form-control"
                        value={newAllergy.severity}
                        onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value })}
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reaction</label>
                    <textarea
                      className="form-control"
                      placeholder="Describe the allergic reaction"
                      value={newAllergy.reaction}
                      onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                      rows="2"
                    ></textarea>
                  </div>
                  <button className="btn btn-primary" onClick={handleAddAllergy}>
                    <i className="fas fa-plus me-2"></i>Add Allergy
                  </button>
                </div>
              </div>

              {healthProfile && healthProfile.allergies.length > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Your Allergies</h5>
                    {healthProfile.allergies.map((allergy, index) => (
                      <div key={index} className="alert alert-danger">
                        <h6>{allergy.allergen}</h6>
                        <p className="mb-1">
                          <small>Reaction: {allergy.reaction}</small>
                        </p>
                        <p className="mb-0">
                          <small>
                            Severity: <span className="badge bg-danger">{allergy.severity}</span>
                          </small>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === "medications" && healthProfile && healthProfile.medications.length > 0 && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Your Medications</h5>
                {healthProfile.medications.map((med, index) => (
                  <div key={index} className="alert alert-secondary">
                    <h6>{med.name}</h6>
                    <p className="mb-1">
                      <small>
                        <strong>Dosage:</strong> {med.dosage} | <strong>Frequency:</strong> {med.frequency}
                      </small>
                    </p>
                    <p className="mb-0">
                      <small>
                        <strong>Prescribed by:</strong> {med.prescribedBy}
                      </small>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HealthProfile;

