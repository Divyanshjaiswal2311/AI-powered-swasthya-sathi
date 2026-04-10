import React, { useState } from "react";
import Layout from "../components/shared/Layout/Layout";
import "./MedicalRecords.css";
import { FaFileUpload, FaFilePdf, FaFileImage, FaShare, FaTrash, FaDownload, FaLock } from "react-icons/fa";

const MedicalRecords = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      name: "Lab Report - Blood Test",
      type: "pdf",
      date: "2026-04-01",
      doctor: "Dr. Smith",
      category: "Lab Report",
      size: "2.4 MB",
      shared: false,
      icon: <FaFilePdf />
    },
    {
      id: 2,
      name: "X-Ray Report",
      type: "pdf",
      date: "2026-03-25",
      doctor: "Dr. Johnson",
      category: "Radiology",
      size: "5.1 MB",
      shared: true,
      icon: <FaFileImage />
    },
    {
      id: 3,
      name: "Prescription - Medication",
      type: "pdf",
      date: "2026-03-20",
      doctor: "Dr. Williams",
      category: "Prescription",
      size: "1.8 MB",
      shared: false,
      icon: <FaFilePdf />
    }
  ]);

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const newRecord = {
        id: records.length + 1,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        date: new Date().toISOString().split('T')[0],
        doctor: "You",
        category: "Personal",
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        shared: false,
        icon: file.type.includes('pdf') ? <FaFilePdf /> : <FaFileImage />
      };
      setRecords([newRecord, ...records]);
      setUploadedFile(null);
    }
  };

  const handleDelete = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const handleShare = (id) => {
    setRecords(records.map(record =>
      record.id === id ? { ...record, shared: !record.shared } : record
    ));
  };

  return (
    <Layout>
      <div className="medical-records">
        <div className="records-header">
          <h1>📋 Medical Records Management</h1>
          <p>Securely store and manage your medical documents</p>
        </div>

        <div className="records-content">
          {/* Upload Section */}
          <div className="upload-section">
            <div className="upload-box">
              <FaFileUpload className="upload-icon" />
              <h2>Upload Medical Documents</h2>
              <p>Drag and drop or click to upload (PDF, Images)</p>
              <input
                type="file"
                onChange={handleFileUpload}
                className="file-input"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <button className="upload-btn">Choose Files</button>
            </div>

            {/* Quick Info Cards */}
            <div className="info-cards">
              <div className="info-card">
                <div className="icon">📁</div>
                <h3>Total Documents</h3>
                <p>{records.length}</p>
              </div>
              <div className="info-card">
                <div className="icon">🔒</div>
                <h3>Secure Storage</h3>
                <p>End-to-end encrypted</p>
              </div>
              <div className="info-card">
                <div className="icon">👥</div>
                <h3>Shared Documents</h3>
                <p>{records.filter(r => r.shared).length}</p>
              </div>
              <div className="info-card">
                <div className="icon">⚡</div>
                <h3>Quick Access</h3>
                <p>Anytime, Anywhere</p>
              </div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="records-controls">
            <div className="category-filter">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Lab Reports</button>
              <button className="filter-btn">Prescriptions</button>
              <button className="filter-btn">Radiology</button>
            </div>
            <div className="sort-options">
              <select className="sort-select">
                <option>Sort by: Newest First</option>
                <option>Sort by: Oldest First</option>
                <option>Sort by: Name</option>
              </select>
            </div>
          </div>

          {/* Records Table/Cards View */}
          <div className="records-list">
            {records.length > 0 ? (
              <div className="records-grid">
                {records.map((record) => (
                  <div key={record.id} className="record-card">
                    <div className="record-header">
                      <div className="record-icon">{record.icon}</div>
                      <div className="record-badges">
                        {record.shared && (
                          <span className="badge shared">Shared</span>
                        )}
                        <span className="badge category">{record.category}</span>
                      </div>
                    </div>

                    <div className="record-body">
                      <h3 className="record-name">{record.name}</h3>
                      <div className="record-meta">
                        <div className="meta-item">
                          <span className="label">Doctor:</span>
                          <span className="value">{record.doctor}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">Date:</span>
                          <span className="value">{record.date}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">Size:</span>
                          <span className="value">{record.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="record-actions">
                      <button
                        className="action-btn download"
                        title="Download"
                      >
                        <FaDownload /> Download
                      </button>
                      <button
                        className={`action-btn ${record.shared ? 'shared' : 'share'}`}
                        onClick={() => handleShare(record.id)}
                        title="Share"
                      >
                        <FaShare /> {record.shared ? 'Unshare' : 'Share'}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(record.id)}
                        title="Delete"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaFileUpload className="empty-icon" />
                <h3>No Medical Records Yet</h3>
                <p>Start by uploading your first medical document</p>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2>Why Use Medical Records?</h2>
            <div className="features-grid">
              <div className="feature">
                <FaLock className="feature-icon" />
                <h3>Secure Storage</h3>
                <p>All documents are encrypted with bank-level security</p>
              </div>
              <div className="feature">
                <FaShare className="feature-icon" />
                <h3>Easy Sharing</h3>
                <p>Share specific documents with doctors or family members</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🔍</div>
                <h3>AI Analysis</h3>
                <p>Get AI insights and summaries of your documents</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <h3>Mobile Access</h3>
                <p>Access your records anytime, anywhere from any device</p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <h3>Fast Upload</h3>
                <p>Quick and easy document upload process</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🔄</div>
                <h3>Auto Organization</h3>
                <p>Documents are automatically organized by category</p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="tips-section">
            <h2>📌 Tips for Managing Medical Records</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-number">1</div>
                <h3>Organize Regularly</h3>
                <p>Keep your records organized by category and date for quick access</p>
              </div>
              <div className="tip-card">
                <div className="tip-number">2</div>
                <h3>Share Wisely</h3>
                <p>Only share sensitive documents with trusted healthcare providers</p>
              </div>
              <div className="tip-card">
                <div className="tip-number">3</div>
                <h3>Keep Backups</h3>
                <p>Ensure you have backup copies of important documents</p>
              </div>
              <div className="tip-card">
                <div className="tip-number">4</div>
                <h3>Update Regularly</h3>
                <p>Add new documents immediately after medical visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MedicalRecords;

