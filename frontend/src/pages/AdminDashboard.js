"use client"

import "../styles/AdminDashboard.css"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { getAdminblog, getAdminusers, deleteblogByAmin } from "../services/api"
import { Users, FileText, Trash2, Eye, Calendar, BarChart3, TrendingUp } from "lucide-react"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const queryClient = useQueryClient()

  const { data: stats } = useQuery("adminStats", async () => {
    try {
      const [blogsRes, usersRes] = await Promise.all([getAdminblog(), getAdminusers()])
      return {
        blogs: blogsRes.data.blogs,
        users: usersRes.data.users,
        totalBlogs: blogsRes.data.blogs.length,
        totalUsers: usersRes.data.users.length,
        totalViews: blogsRes.data.blogs.reduce((sum, blog) => sum + blog.views, 0),
        totalLikes: blogsRes.data.blogs.reduce((sum, blog) => sum + blog.likes.length, 0),
      }
    } catch (error) {
      // Fallback data for demo purposes
      return {
        blogs: [],
        users: [],
        totalBlogs: 0,
        totalUsers: 0,
        totalViews: 0,
        totalLikes: 0,
      }
    }
  })

  const deleteBlogMutation = useMutation(
    async (blogId) => {
      await deleteblogByAmin(blogId)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("adminStats")
      },
    },
  )

  const handleDeleteBlog = (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlogMutation.mutate(blogId)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" style={{ width: "4rem", height: "4rem" }}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor your blog platform performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <FileText style={{ width: "2rem", height: "2rem" }} className="text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{stats.totalBlogs}</h3>
              <p className="text-gray-600">Total Blogs</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <Users style={{ width: "2rem", height: "2rem" }} className="text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <Eye style={{ width: "2rem", height: "2rem" }} className="text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
              <p className="text-gray-600">Total Views</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <TrendingUp style={{ width: "2rem", height: "2rem" }} className="text-red-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{stats.totalLikes}</h3>
              <p className="text-gray-600">Total Likes</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="card-header">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 border-b-2 font-medium ${
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 style={{ width: "1rem", height: "1rem", display: "inline", marginRight: "0.5rem" }} />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("blogs")}
                className={`pb-2 border-b-2 font-medium ${
                  activeTab === "blogs"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText style={{ width: "1rem", height: "1rem", display: "inline", marginRight: "0.5rem" }} />
                All Blogs
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`pb-2 border-b-2 font-medium ${
                  activeTab === "users"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users style={{ width: "1rem", height: "1rem", display: "inline", marginRight: "0.5rem" }} />
                Users
              </button>
            </div>
          </div>

          <div className="card-body">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
                {stats.blogs && stats.blogs.length > 0 ? (
                  <div className="space-y-4">
                    {stats.blogs.slice(0, 5).map((blog) => (
                      <div
                        key={blog._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{blog.title}</h3>
                          <p className="text-sm text-gray-600">
                            by {blog.author.firstName} {blog.author.lastName} • {formatDate(blog.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{blog.views} views</span>
                          <span>{blog.likes.length} likes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No blog data available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "blogs" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">All Blogs</h2>
                {stats.blogs && stats.blogs.length > 0 ? (
                  <div className="space-y-4">
                    {stats.blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="badge badge-primary">{blog.category}</span>
                            <span className="text-sm text-gray-500">
                              <Calendar
                                style={{
                                  width: "0.75rem",
                                  height: "0.75rem",
                                  display: "inline",
                                  marginRight: "0.25rem",
                                }}
                              />
                              {formatDate(blog.createdAt)}
                            </span>
                          </div>
                          <h3 className="font-semibold mb-1">{blog.title}</h3>
                          <p className="text-sm text-gray-600">
                            by {blog.author.firstName} {blog.author.lastName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-500 text-right">
                            <div>{blog.views} views</div>
                            <div>{blog.likes.length} likes</div>
                          </div>
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="btn btn-danger"
                            disabled={deleteBlogMutation.isLoading}
                          >
                            <Trash2 style={{ width: "1rem", height: "1rem" }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No blogs available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">All Users</h2>
                {stats.users && stats.users.length > 0 ? (
                  <div className="space-y-4">
                    {stats.users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Joined {formatDate(user.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-secondary"}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No users available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
