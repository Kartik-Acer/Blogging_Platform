"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import { getProfile, getUsersblog } from "../services/api"
import { User, Mail, Calendar, Edit, Eye, Heart, MessageCircle, Plus } from "lucide-react"
import "../styles/Profile.css"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("blogs")

  // Get user from localStorage or API
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
    
      // Fetch user data
     getProfile()
        .then((response) => setUser(response.data))
        .catch((error) => console.error("Failed to fetch user:", error))
    }
  }, [])

  const { data: userBlogs, isLoading } = useQuery(
    ["userBlogs"],
    async () => {
      //const response = await axios.get("/api/users/blogs")
      const response = await getUsersblog();
      return response.data.blogs
    },
    {
      enabled: !!user,
    },
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  {user.avatar && (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="text-blue-600"
                      style={{ width: "7rem", height: "8rem", borderRadius: "20px" }}
                    />
                  )}
                  {/* {<User style={{ width: "5rem", height: "3rem" }} className="text-blue-600" />} */}
                </div>
                
                <div style={{paddingLeft:"10px"}}>
                  <h1 className="text-3xl font-bold mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Mail style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                  {user.bio && <p className="text-gray-700 max-w-2xl">{user.bio}</p>}
                </div>
              </div>
              <button className="btn btn-secondary">
                <Link to="/EditProfile" className="btn btn-secondary">
                 <Edit style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                  Edit Profile
                </Link>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold text-blue-600">{userBlogs?.length || 0}</h3>
              <p className="text-gray-600">Blog Posts</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold text-green-600">
                {userBlogs?.reduce((total, blog) => total + blog.likes.length, 0) || 0}
              </h3>
              <p className="text-gray-600">Total Likes</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold text-purple-600">
                {userBlogs?.reduce((total, blog) => total + blog.views, 0) || 0}
              </h3>
              <p className="text-gray-600">Total Views</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="card-header">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("blogs")}
                className={`pb-3 font-medium ${
                  activeTab === "blogs"
                    ? "text-white bg-blue-600 rounded-lg active border-transparent"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                My Blogs
              </button>
              {/* <button
                onClick={() => setActiveTab("drafts")}
                className={`pb-2 border-b-2 font-medium ${
                  activeTab === "drafts"
                    ? "text-white bg-blue-600 rounded-lg active border-transparent"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Drafts
              </button> */}
            </div>
          </div>

          <div className="card-body">
            {activeTab === "blogs" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Published Blogs</h2>
                  <Link to="/create-blog" className="btn btn-primary">
                    <Plus style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                    New Blog
                  </Link>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="loading-spinner"></div>
                  </div>
                ) : userBlogs && userBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {userBlogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="badge badge-primary">{blog.category}</span>
                              <span className="text-sm text-gray-500">{formatDate(blog.createdAt)}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                              <Link to={`/blog/${blog._id}`} className="hover:text-blue-600 transition-colors">
                                {blog.title}
                              </Link>
                            </h3>
                            {blog.excerpt && <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Eye style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                                {blog.views}
                              </span>
                              <span className="flex items-center">
                                <Heart style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                                {blog.likes.length}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                                {blog.comments.length}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Link to={`/edit-blog/${blog._id}`} className="btn btn-secondary">
                              <Edit style={{ width: "1rem", height: "1rem" }} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs yet</h3>
                    <p className="text-gray-600 mb-4">Start sharing your thoughts with the world!</p>
                    <Link to="/create-blog" className="btn btn-primary">
                      Write Your First Blog
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "drafts" && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No drafts</h3>
                <p className="text-gray-600">Draft functionality will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
