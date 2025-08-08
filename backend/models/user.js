const mongoose = require("mongoose"); // import mongoose

const userSchema = new mongoose.Schema({
  // Define user fields
  username: String,
  email: { type: String, unique: true },
  password: String,
   firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
      default: "",
    },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("user", userSchema); // Export model for use
