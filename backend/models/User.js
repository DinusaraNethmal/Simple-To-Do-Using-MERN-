const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true // Prevents two people from using the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false // They start as unverified until they enter the code
  },
  verificationCode: {
    type: String
  }
});

module.exports = mongoose.model("User", UserSchema);