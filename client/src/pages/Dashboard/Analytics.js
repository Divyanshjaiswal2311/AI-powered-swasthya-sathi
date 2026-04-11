import React, { useState, useEffect } from "react";
import Header from "../../components/shared/Layout/Header";
import API from "./../../services/API";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    quantity: "",
    inventoryType: "in",
  });
  const [loading, setLoading] = useState(false);
  
  const colors = [
    "#884A39",
    "#C38154",
    "#FFC26F",
    "#4F709C",
    "#4942E4",
    "#0079FF",
    "#FF0060",
    "#22A699",
  ];
  
  //GET BLOOD GROUP DATA
  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");
      if (data?.success) {
        setData(data?.bloodGroupData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //lifrecycle method
  useEffect(() => {
    getBloodGroupData();
  }, []);

  //get function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-recent-inventory");
      if (data?.success) {
        setInventoryData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle blood donation form submit
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bloodGroup || !formData.quantity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/inventory/create-inventory", {
        bloodGroup: formData.bloodGroup,
        quantity: parseInt(formData.quantity),
        inventoryType: formData.inventoryType,
        donar: user?._id,
        email: user?.email,
        organisation: user?._id,  // Add organisation field
        userId: user?._id,        // Add userId field
      });

      if (data?.success) {
        toast.success("Blood donation recorded successfully!");
        setFormData({
          bloodGroup: "",
          quantity: "",
          inventoryType: "in",
        });
        // Refresh data
        getBloodGroupData();
        getBloodRecords();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to record blood donation");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Header />
      
      {/* Blood Donation Input Form */}
      <div className="container my-4">
        <div className="card border-danger">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">💉 Record Blood Donation</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleDonationSubmit}>
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label">Blood Group</label>
                  <select
                    className="form-select"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">-- Select Blood Group --</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Quantity (ML)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    placeholder="Enter quantity in ML"
                    min="1"
                    max="500"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    name="inventoryType"
                    value={formData.inventoryType}
                    onChange={handleFormChange}
                  >
                    <option value="in">Donation (In)</option>
                    <option value="out">Used (Out)</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    type="submit"
                    className="btn btn-danger w-100"
                    disabled={loading}
                  >
                    {loading ? "Recording..." : "Record Donation"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="d-flex flex-row flex-wrap">
        {data?.map((record, i) => (
          <div
            className="card m-2 p-1"
            key={i}
            style={{ width: "18rem", backgroundColor: `${colors[i]}` }}
          >
            <div className="card-body">
              <h1 className="card-title bg-light text-dark text-center mb-3">
                {record.bloodGroup}
              </h1>
              <p className="card-text">
                Total In : <b>{record.totalIn}</b> (ML)
              </p>
              <p className="card-text">
                Total Out : <b>{record.totalOut}</b> (ML)
              </p>
            </div>
            <div className="card-footer text-light bg-dark text-center">
              Total Available : <b>{record.availabeBlood}</b> (ML)
            </div>
          </div>
        ))}
      </div>
      <div className="container my-3">
        <h1 className="my-3">Recent Blood Transactions</h1>
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">Blood Group</th>
              <th scope="col">Inventory Type</th>
              <th scope="col">Quantity</th>
              <th scope="col">Donar Email</th>
              <th scope="col">TIme & Date</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData?.map((record) => (
              <tr key={record._id}>
                <td>{record.bloodGroup}</td>
                <td>{record.inventoryType}</td>
                <td>{record.quantity} (ML)</td>
                <td>{record.email}</td>
                <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Analytics;
