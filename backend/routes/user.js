const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/user")
const Blog = require("../models/blog")
const { auth } = require("../middleware/auth")
const cloudinary = require("../config/cloudinary")
const multer = require("multer")
const bcrypt = require("bcryptjs");

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/user/updatePass", auth, async (req, res) =>{
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const { oldPassword, newPassword} = req.body;


    const isMatch = oldPassword === user.password ? true : false;

    if (!isMatch) return res.status(400).json({ message: "Old Password not valid" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({ message: "Success!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/user/profile",
  auth,
  upload.single("avatar"),
  [
    body("firstName").optional().trim().escape(),
    body("lastName").optional().trim().escape(),
    body("bio").optional().trim().escape(),
  ],
  async (req, res) => {
    console.log(req.file)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { firstName, lastName, bio } = req.body
      let avatar = req.user.avatar

      // Upload new avatar if provided
      if (req.file) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "avatars" }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
              })
              .end(req.file.buffer)
          })

          avatar = result.secure_url
        } catch (uploadError) {
          console.error("Avatar upload error:", uploadError)
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          firstName: firstName || req.user.firstName,
          lastName: lastName || req.user.lastName,
          bio: bio !== undefined ? bio : req.user.bio,
          avatar,
        },
        { new: true },
      )

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user's blogs
router.get("/users/blogs", auth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const blogs = await Blog.find({ author: req.user._id })
      .populate("author", "username firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments({ author: req.user._id })
    
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

module.exports = router
