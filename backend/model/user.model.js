import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"]
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters"]
  },

  // Role-based access
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  //  Ban support for admins
  isBanned: {
    type: Boolean,
    default: false
  },

  // Voting tracking
  upvotedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  downvotedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  upvotedAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  downvotedAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]

}, {
  timestamps: true
});

// 👇 Pre-save: hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 👇 Compare input password with hashed one
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
