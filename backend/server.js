const express = require("express"); //import express framework
const mongose = require("mongoose"); // connect and work with mongoDb
const cors = require("cors"); // Enable cors-origin-resourse sharing (front-end api calls)
const helmet = require("helmet");
const rateLimit = require("express-rate-limit")
require("dotenv").config(); // Load Environment variables from .env


const app = express(); // Initialize express application

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter);

app.use(cors()); //Allo front end to access backend

app.use(express.json()); //pars incoming json request bodies

app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/blog"));
app.use("/api", require("./routes/admin"))
app.use("/api", require("./routes/user"))



mongose
  .connect(process.env.MONGO_URI) // Connect to MongoDB atlas using .env key
  .then(() => console.log("MongoDb Connected")) //success
  .catch((err) => console.error("DB Error:", err)); //failure

const PORT = process.env.PORT || 5000; //// Use PORT from .env or default to 5000
app.listen(PORT, () => console.log(`server running on port ${PORT}`)); //start server
