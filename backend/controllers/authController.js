const User = require("../models/user"); // Import User model
const bcrypt = require("bcryptjs"); // For Hashing password
const jwt = require("jsonwebtoken"); // For generating JWT tokens

exports.register = async (req, res) => {
  const {firstName, lastName, username, email, password} = req.body; // Destructure request body
  const hashedPassword = await bcrypt.hash(password, 10); // Encrypt password

  try {
    const user = new User({firstName,lastName, username, email, password : hashedPassword}); // create user obj
    await user.save(); // save user to DB
    res.status(201).json({ message: "User registered" }); //Respond success
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Email already exists" }); //catch duplicate email
  }
};


// Login function

exports.login = async (req, res) => {
  const { email, password } = req.body; // Destructure request body

  const user = await User.findOne({ email }); // Find user by email

  if (!user) return res.status(400).json({ error: "invalid credentials" });

  let isMatch = false;

  if(user.password.length >= 20)
     isMatch = await bcrypt.compare(password, user.password); //Compare password
  else
     isMatch = password === user.password ? true : false;
  
  if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

  if (!user.isActive) return res.status(400).json({ error: "Access denied! Please contact your admin" });

  const token = jwt.sign(
    { userid: user._id, role: user.role },
    process.env.JWT_SECRET
  ); //Create JWT token
  res.json({ token, role: user.role, name: user.username }); // Respond with token and role
};


