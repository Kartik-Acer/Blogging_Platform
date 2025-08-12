const express = require("express")
const { body, validationResult } = require("express-validator")
const Blog = require("../models/blog")
const { auth }  = require("../middleware/auth")
const cloudinary = require("../config/cloudinary")
const multer = require("multer")

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Get all blogs with pagination and search
router.get("/blogs", async (req, res) => {
  try {
    
    console.log(req.query.category);
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ""
    const category = req.query.category || ""
    const tag = req.query.tag || ""

    const query = { status: "published" }

    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category) {
      query.category = new RegExp(category, "i")
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [new RegExp(tag, "i")] }
    }
     
    console.log(query);

    const blogs = await Blog.find(query)
      .populate("author", "username firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments(query)
    
    res.json({
      blogs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {

    res.status(500).json({ message: "Server error" })
  }
})

// Get single blog
router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username firstName lastName avatar bio")
      .populate("comments.user", "username firstName lastName avatar")

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Increment views
    blog.views += 1
    await blog.save()

    res.json(blog)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create blog
router.post(
  "/blogs",
  auth,
  upload.single("featuredImage"),
  [body("title").notEmpty().trim().escape(), body("content").notEmpty(), body("category").notEmpty().trim().escape()],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, content, excerpt, category, tags, status } = req.body
      let featuredImage = ""

      // Upload image to Cloudinary if provided
      if (req.file) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "blog-images" }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
              })
              .end(req.file.buffer)
          })
          featuredImage = result.secure_url
        } catch (uploadError) {
          console.error("Image upload error:", uploadError)
        }
      }

      const blog = new Blog({
        title,
        content,
        excerpt,
        author: req.user._id,
        featuredImage,
        category,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        status: status || "published",
      })

      await blog.save()
      await blog.populate("author", "username firstName lastName avatar")

      res.status(201).json({
        message: "Blog created successfully",
        blog,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update blog
router.put("/blogs/:id", auth, upload.single("featuredImage"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const { title, content, excerpt, category, tags, status } = req.body
    let featuredImage = blog.featuredImage

    // Upload new image if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "blog-images" }, (error, result) => {
              if (error) reject(error)
              else resolve(result)
            })
            .end(req.file.buffer)
        })
        featuredImage = result.secure_url
      } catch (uploadError) {
        console.error("Image upload error:", uploadError)
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: title || blog.title,
        content: content || blog.content,
        excerpt: excerpt || blog.excerpt,
        featuredImage,
        category: category || blog.category,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : blog.tags,
        status: status || blog.status,
      },
      { new: true },
    ).populate("author", "username firstName lastName avatar")

    res.json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete blog
router.delete("/blogs/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Check if user owns the blog or is admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Blog.findByIdAndDelete(req.params.id)

    res.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Like/Unlike blog
router.post("/blogs/:id/like", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    const existingLike = blog.likes.find((like) => like.user.toString() === req.user._id.toString())

    if (existingLike) {
      // Unlike
      blog.likes = blog.likes.filter((like) => like.user.toString() !== req.user._id.toString())
    } else {
      // Like
      blog.likes.push({ user: req.user._id })
    }

    await blog.save()

    res.json({
      message: existingLike ? "Blog unliked" : "Blog liked",
      likesCount: blog.likes.length,
      isLiked: !existingLike,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add comment
router.post("/blogs/:id/comments", auth, [body("content").notEmpty().trim().escape()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    const newComment = {
      user: req.user._id,
      content: req.body.content,
    }

    blog.comments.push(newComment)
    await blog.save()

    await blog.populate("comments.user", "username firstName lastName avatar")

    res.status(201).json({
      message: "Comment added successfully",
      comment: blog.comments[blog.comments.length - 1],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router