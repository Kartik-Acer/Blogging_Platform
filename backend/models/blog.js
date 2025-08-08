const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    featuredImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [commentSchema],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    readTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate read time based on content
blogSchema.pre("save", function (next) {
  if (this.content) {
    const wordsPerMinute = 200
    const wordCount = this.content.split(" ").length
    this.readTime = Math.ceil(wordCount / wordsPerMinute)
  }
  next()
})

// Create text index for search
blogSchema.index({
  title: "text",
  content: "text",
  category: "text",
  tags: "text",
})

module.exports = mongoose.model("Blog", blogSchema)
