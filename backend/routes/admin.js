const express = require("express")
const User = require("../models/user")
const Blog = require("../models/blog")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all users (admin only)
router.get("/admin/users", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const users = await User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocuments()

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all blogs (admin only)
router.get("/admin/blogs", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const blogs = await Blog.find()
      .populate("author", "username firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments()

    res.json({
      blogs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete any blog (admin only)
router.delete("/admin/blogs/:id", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    await Blog.findByIdAndDelete(req.params.id)

    res.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user role (admin only)
router.put("/users/:id/role", adminAuth, async (req, res) => {
  try {
    const { role } = req.body

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User role updated successfully",
      user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Deactivate user (admin only)
router.put("/users/:id/deactivate", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User deactivated successfully",
      user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get platform statistics (admin only)
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalBlogs = await Blog.countDocuments()
    const totalViews = await Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }])
    const totalLikes = await Blog.aggregate([{ $group: { _id: null, total: { $sum: { $size: "$likes" } } } }])

    const recentBlogs = await Blog.find().populate("author", "firstName lastName").sort({ createdAt: -1 }).limit(5)

    const recentUsers = await User.find().select("-password").sort({ createdAt: -1 }).limit(5)

    res.json({
      totalUsers,
      totalBlogs,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      recentBlogs,
      recentUsers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
