import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    required: true,
   
  },
  tags: {
    type: [String], 
    required: true,
    validate: [(val) => val.length > 0, 'At least one tag is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votes: {
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer",
    default: null,
  },
}, {
  timestamps: true 
});

const Question =  mongoose.model("Question", questionSchema);
export default Question;
