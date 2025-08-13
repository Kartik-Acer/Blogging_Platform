import React, { useState } from "react";
import "../styles/ChangePassword.css"

const ChangePassord = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Change Password</h2>
        <form className="auth-form">
          <div className="form-group">
            <input
              id="password"
              name="password"
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
              id="password"
              name="password"
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
              id="password"
              name="password"
              type="password"
              required
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="form-input has-icon-left has-icon-right"
              placeholder="Confirm new password"
            />
          </div>
          <button className="auth-button" type="submit">
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassord;
