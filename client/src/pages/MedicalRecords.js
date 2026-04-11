import React, { useState, useRef } from "react";
import Layout from "../components/shared/Layout/Layout";
import { useSelector } from "react-redux";
import API from "../services/API";
import "./MedicalRecords.css";
import { 
  FaFileUpload, FaFilePdf, FaFileImage, FaTrash, FaDownload, 
  FaSpinner, FaCheckCircle, FaExclamationTriangle, FaHeartbeat,
  FaAmbulance, FaUserMd, FaTimes, FaBrain
} from "react-icons/fa";
import { toast } from "react-toastify";

const MedicalRecords = () => {
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  // State Management
  const [records, setRecords] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(true);

  // Fetch medical records on component mount
  React.useEffect(() => {
    fetchMedicalRecords();
  }, [user]);

  const fetchMedicalRecords = async () => {
    try {
      setLoadingRecords(true);
      const { data } = await API.post("/medical-records/get-records", {
        userId: user?._id
      });
      if (data?.success) {
        setRecords(data.records || []);
      }
    } catch (error) {
      console.log("Error fetching records:", error);
      // Don't show error for first load
    } finally {
      setLoadingRecords(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF or Image files only");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?._id);
      formData.append('documentTitle', file.name.split('.')[0]);
      formData.append('documentType', detectDocumentType(file.name));
      formData.append('documentDate', new Date().toISOString());

      // Upload file
      const { data } = await API.post("/medical-records/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data?.success) {
        toast.success("Medical record uploaded successfully!");
        setRecords([data.record, ...records]);
        fileInputRef.current.value = '';
        
        // Automatically trigger AI analysis
        setTimeout(() => analyzeRecord(data.record._id, file.name), 1000);
      }
    } catch (error) {
      console.log("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Detect document type from filename
  const detectDocumentType = (fileName) => {
    const lower = fileName.toLowerCase();
    if (lower.includes('cbc') || lower.includes('blood')) return 'lab_report';
    if (lower.includes('lft') || lower.includes('liver')) return 'pathology_report';
    if (lower.includes('kft') || lower.includes('kidney')) return 'pathology_report';
    if (lower.includes('x-ray') || lower.includes('xray')) return 'imaging';
    if (lower.includes('report')) return 'diagnostic_report';
    if (lower.includes('prescription')) return 'prescription';
    return 'other';
  };

  // Analyze Medical Record with AI
  const analyzeRecord = async (recordId, fileName) => {
    try {
      setAnalyzing(true);
      setSelectedRecord(recordId);

      const { data } = await API.post("/ai-health/analyze-report", {
        recordId,
        userId: user?._id,
        reportType: detectDocumentType(fileName)
      });

      if (data?.success) {
        setAnalysisResult(data.analysis);
        setShowAnalysisModal(true);
        toast.success("AI analysis completed!");
        
        // Update the record in list with analysis
        setRecords(records.map(r => 
          r._id === recordId ? { ...r, aiAnalysis: data.analysis } : r
        ));
      } else {
        toast.error("AI analysis failed - please try again");
      }
    } catch (error) {
      console.log("Analysis error:", error);
      toast.error("Failed to analyze report");
    } finally {
      setAnalyzing(false);
    }
  };

  // Delete Medical Record
  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const { data } = await API.delete(`/api/v1/medical-records/delete/${recordId}`);
      
      if (data?.success) {
        setRecords(records.filter(r => r._id !== recordId));
        toast.success("Record deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  // Download Medical Record
  const handleDownload = (fileUrl, fileName) => {
    if (!fileUrl) {
      toast.error("File URL not available");
      return;
    }
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'medical-record';
    link.click();
  };

  return (
    <Layout>
      <div className="medical-records">
        {/* Header */}
        <div className="records-header">
          <div>
            <h1>📋 Medical Records Management</h1>
            <p>Upload, analyze, and manage your health test reports with AI-powered insights</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="records-container">
          {/* Upload Section */}
          <div className="upload-card">
            <div 
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) {
                  fileInputRef.current.files = e.dataTransfer.files;
                  handleFileUpload({ target: fileInputRef.current });
                }
              }}
            >
              <FaFileUpload className="upload-icon" />
              <h3>Upload Medical Report</h3>
              <p>Drag & drop your test reports (CBC, LFT, KFT, X-Ray, etc.)</p>
              <button className="upload-btn" disabled={uploading}>
                {uploading ? (
                  <>
                    <FaSpinner className="spinner" /> Uploading...
                  </>
                ) : (
                  'Choose Files'
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                hidden
              />
              <p className="upload-hint">Supported: PDF, JPG, PNG (Max 10MB)</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="info-grid">
            <div className="info-card">
              <FaHeartbeat className="info-icon health" />
              <h4>Health Reports</h4>
              <p>Secure storage of all medical documents</p>
            </div>
            <div className="info-card">
              <FaBrain className="info-icon ai" />
              <h4>AI Analysis</h4>
              <p>Instant AI-powered report analysis</p>
            </div>
            <div className="info-card">
              <FaAmbulance className="info-icon first-aid" />
              <h4>First Aid</h4>
              <p>Immediate action recommendations</p>
            </div>
            <div className="info-card">
              <FaUserMd className="info-icon doctor" />
              <h4>Doctor Consultation</h4>
              <p>Know when to consult a specialist</p>
            </div>
          </div>

          {/* Medical Records List */}
          <div className="records-section">
            <div className="section-header">
              <h2>Your Medical Records ({records.length})</h2>
              {records.length > 0 && <span className="record-count">{records.length} documents</span>}
            </div>

            {loadingRecords ? (
              <div className="loading-state">
                <FaSpinner className="spinner" />
                <p>Loading your records...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="empty-state">
                <FaFileUpload className="empty-icon" />
                <h3>No Medical Records Yet</h3>
                <p>Upload your first health report to get started with AI-powered analysis</p>
              </div>
            ) : (
              <div className="records-grid">
                {records.map((record) => (
                  <div key={record._id} className="record-card">
                    <div className="record-header">
                      <div className="record-icon">
                        {record.mimeType?.includes('pdf') ? 
                          <FaFilePdf /> : <FaFileImage />
                        }
                      </div>
                      <div className="record-title">
                        <h4>{record.documentTitle}</h4>
                        <p className="record-type">{record.documentType?.replace(/_/g, ' ')}</p>
                      </div>
                    </div>

                    <div className="record-details">
                      <div className="detail-item">
                        <span className="label">Date:</span>
                        <span>{new Date(record.documentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Doctor:</span>
                        <span>{record.doctor?.name || 'Self-uploaded'}</span>
                      </div>
                      {record.aiAnalysis && (
                        <div className="detail-item has-analysis">
                          <FaCheckCircle className="check-icon" />
                          <span>AI Analyzed</span>
                        </div>
                      )}
                    </div>

                    {record.aiAnalysis && (
                      <div className="analysis-preview">
                        <h5>AI Summary</h5>
                        <p>{record.aiAnalysis.summary?.substring(0, 100)}...</p>
                      </div>
                    )}

                    <div className="record-actions">
                      {!record.aiAnalysis ? (
                        <button
                          className="action-btn analyze"
                          onClick={() => analyzeRecord(record._id, record.documentTitle)}
                          disabled={analyzing}
                        >
                          {analyzing && selectedRecord === record._id ? (
                            <>
                              <FaSpinner className="spinner" /> Analyzing...
                            </>
                          ) : (
                            <>🤖 Analyze</>
                          )}
                        </button>
                      ) : (
                        <button
                          className="action-btn view"
                          onClick={() => {
                            setAnalysisResult(record.aiAnalysis);
                            setShowAnalysisModal(true);
                          }}
                        >
                          📊 View
                        </button>
                      )}
                      <button
                        className="action-btn download"
                        onClick={() => handleDownload(record.fileUrl, record.fileName)}
                      >
                        <FaDownload />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(record._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysisModal && analysisResult && (
          <div className="analysis-modal-overlay" onClick={() => setShowAnalysisModal(false)}>
            <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                className="close-btn"
                onClick={() => setShowAnalysisModal(false)}
              >
                <FaTimes />
              </button>

              <div className="modal-header">
                <h2>🤖 AI Health Report Analysis</h2>
                <p className="modal-subtitle">Comprehensive analysis powered by AI</p>
              </div>

              <div className="modal-content">
                {/* Summary */}
                {analysisResult.summary && (
                  <section className="analysis-section">
                    <h3>📄 Summary</h3>
                    <p className="analysis-text">{analysisResult.summary}</p>
                  </section>
                )}

                {/* Key Findings */}
                {analysisResult.keyFindings && analysisResult.keyFindings.length > 0 && (
                  <section className="analysis-section">
                    <h3>🔍 Key Findings</h3>
                    <ul className="findings-list">
                      {analysisResult.keyFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Abnormal Values */}
                {analysisResult.abnormalValues && analysisResult.abnormalValues.length > 0 && (
                  <section className="analysis-section warning">
                    <h3>⚠️ Abnormal Values</h3>
                    <div className="abnormal-values">
                      {analysisResult.abnormalValues.map((value, idx) => (
                        <div key={idx} className={`abnormal-item severity-${value.severity}`}>
                          <strong>{value.parameter}:</strong>
                          <span> {value.value} (Normal: {value.normalRange})</span>
                          <small className={`severity-badge severity-${value.severity}`}>
                            {value.severity?.toUpperCase() || 'ABNORMAL'}
                          </small>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* First Aid Recommendations */}
                <section className="analysis-section first-aid-section">
                  <h3>🚑 Immediate Actions</h3>
                  <div className="first-aid-box">
                    <h4>What You Should Do Now:</h4>
                    <ul className="recommendations-list">
                      <li>✓ Rest and avoid strenuous activities</li>
                      <li>✓ Stay hydrated and maintain proper diet</li>
                      <li>✓ Monitor your vital signs regularly</li>
                      <li>✓ Take prescribed medications on time</li>
                      <li>✓ Avoid triggers or risk factors</li>
                    </ul>
                  </div>
                </section>

                {/* Doctor Consultation */}
                <section className="analysis-section doctor-section">
                  <h3>👨‍⚕️ Doctor Consultation Recommended</h3>
                  <div className="doctor-box">
                    <FaExclamationTriangle className="warning-icon" />
                    <div className="doctor-info">
                      <h4>Consult a Specialist</h4>
                      <p>Based on your report analysis, we recommend scheduling a consultation with:</p>
                      <ul className="specialist-list">
                        <li>🏥 <strong>Primary Care Physician</strong> - General health assessment</li>
                        <li>🩺 <strong>Pathologist</strong> - Detailed lab report interpretation</li>
                        <li>⚕️ <strong>Specialist Doctor</strong> - Condition-specific treatment</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* General Recommendations */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <section className="analysis-section">
                    <h3>💡 AI Recommendations</h3>
                    <div className="recommendations-box">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <div key={idx} className="recommendation-item">
                          <span className="bullet">•</span>
                          <p>{rec}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Important Note */}
                <section className="analysis-section note-section">
                  <div className="important-note">
                    <strong>⚠️ Medical Disclaimer:</strong>
                    <p>This AI analysis is for informational purposes only and should not be considered as professional medical advice. Always consult with a qualified healthcare professional for proper diagnosis and treatment.</p>
                  </div>
                </section>
              </div>

              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => setShowAnalysisModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MedicalRecords;

