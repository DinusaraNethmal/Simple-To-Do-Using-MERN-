//import packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const PORT = 5000;
//create app
const app = express();

//Middleware (Allows your server to read JSON data from frontend (like POST requests))
app.use(express.json());
app.use(cors());


//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log(err)); 

//Create a test route
app.get("/", (req, res) => {
    res.send("API is working");
});

// Register routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

//Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Import the new routes
const authRoutes = require("./routes/authRoutes");

// Use the routes
app.use("/api/auth", authRoutes);