import React, { useState } from "react";
import "../styles/ChangePassword.css"
import { updatePassword } from "../services/api";
import { useNavigate } from "react-router-dom"

const ChangePassord = () => {
  const navigate = useNavigate();
  const initialForm = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  }
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  
  
  const clearData = () => {
    setFormData(initialForm);
    // Clear to an empty object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try{
       await updatePassword(formData);
       clearData();
       setSuccess("Password updated successfully! Redirecting...")
       
       setTimeout(() => {
         navigate("/profile")
      }, 1500)

    }catch(err){
      setError(err.response.data.message || "Updation failed")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Change Password</h2>
        <form className="auth-form" onSubmit={handleSubmit} >
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <div className="form-group">
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              required
              value={formData.oldPassword}
              onChange={handleChange}
              className="form-input has-icon-left has-icon-right"
              placeholder="Enter old password"
            />
          </div>
           <div className="form-group">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="form-input has-icon-left has-icon-right"
              placeholder="Enter new password"
            />
          </div>
           <div className="form-group">
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              required
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="form-input has-icon-left has-icon-right"
              placeholder="Confirm new password"
            />
          </div>
          <button className="auth-button" disabled={loading} type="submit">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassord;
