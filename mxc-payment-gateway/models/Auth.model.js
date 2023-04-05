const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

// Defines the Auth schema
const AuthSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: { caseInsensitive: true },
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user"
    },
    phone: {
        type: String
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: '',
    },
    verifyAttemptCount: {
        type: Number,
        default: 0
    },
    secret: { 
      type: String,
    },
    twoFactorEnabled: { 
      type: Boolean,
      default: false 
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});


AuthSchema.pre("save", async function(next) {
    const user = this;
  
    if (!user.isModified('password')) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
  
      user.password = hash;
      user.updateAt = Date.now();
  
      next();
    } catch (err) {
      return next(err);
    }
});

// Customize a method to the schema to check if the document has expired
AuthSchema.methods.checkExpired = function() {
  const expirationTime = new Date().getTime() - (30 * 60 * 1000); // 30 mins ago
  return this.createAt.getTime() < expirationTime;
};

// Check if a given password matches the user's password
AuthSchema.methods.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Auth = mongoose.model("Auth", AuthSchema);
module.exports = Auth;
