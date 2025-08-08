const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    console.log("checking header", token)

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
 
    const user = await User.findById(decoded.userid).select("-password")

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {})

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    next()
  } catch (error) {
    res.status(401).json({ message: "Authorization failed" })
  }
}

module.exports = { auth, adminAuth }
