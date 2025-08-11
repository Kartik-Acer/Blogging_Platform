"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile } from "../services/api"
import "../styles/EditProfile.css"

const EditProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: ""
  })
  const [loading, setLoading] = useState(false)
  const [avtarFile, setAvtarFile] = useState(null)

  useEffect(() => {
    getProfile()
      .then((res) => {
        const user = res.data
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          bio: user.bio || "",
          avatar: user.avatar || ""
        })
      })
      .catch((err) => console.error("Error fetching profile", err))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvtarFile(file)
      setFormData({ ...formData, avatar: URL.createObjectURL(file) })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append("firstName", formData.firstName)
      data.append("lastName", formData.lastName)
      data.append("bio", formData.bio)
      if (avtarFile) data.append("avatar", avtarFile)

      await updateProfile(data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate("/profile")
    } catch (err) {
      console.error("Error updating profile", err)
    } finally {
      setLoading(false)
    }
  }

   return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-header">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        
        {/* First Name */}
        <div className="edit-profile-field">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="edit-profile-input"
            required
          />
        </div>

        {/* Last Name */}
        <div className="edit-profile-field">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="edit-profile-input"
            required
          />
        </div>

        {/* Bio */}
        <div className="edit-profile-field">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="edit-profile-textarea"
            maxLength="500"
          ></textarea>
        </div>

        {/* Avatar */}
        <div className="edit-profile-field">
          <label>Profile Picture</label>
          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="Profile"
              className="edit-profile-avatar-preview"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="edit-profile-input"
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="edit-profile-submit"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  )
}

export default EditProfile