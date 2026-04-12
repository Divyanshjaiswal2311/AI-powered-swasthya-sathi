import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { BiUserPlus } from "react-icons/bi";
import { DonationCertificate } from "../../components/shared/Certificate";

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCert, setShowCert] = useState(false);
  const [certData, setCertData] = useState(null);

  // Find user records
  const getUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/inventory/get-users");
      if (data?.success) {
        setData(data?.users);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Helper to show certificate
  const handleShowCertificate = (record) => {
    setCertData({
      userName: record.name || record.organisationName,
      units: 1, // Placeholder, update if you have actual units
      date: record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '',
      qrValue: record._id || record.email || 'record',
    });
    setShowCert(true);
  };

  return (
    <Layout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-dark mb-0">
            <BiUserPlus className="me-2" /> User Records
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name || item.organisationName}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>
                      <span className="badge bg-info">{item.role}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleShowCertificate(item)}
                      >
                        Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            No user records found.
          </div>
        )}

        {/* Certificate Modal */}
        {showCert && certData && (
          <DonationCertificate
            data={certData}
            onClose={() => setShowCert(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default User;
