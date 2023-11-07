import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["jobcreator", "applicant"],
    required: true,
  },
  cvUrl: {
    type: String,
  },
  // Array to store job IDs that the user has applied to (only useful in 'applicant' type)
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

const User = mongoose.model("user", userSchema);
export { User };
