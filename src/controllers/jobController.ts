import { Request, Response } from "express";
import { Job } from "../models/Job";
import { User } from "../models/User";
//
interface CustomRequest extends Request {
  //as no question mark - was the reason of error
  user?: any; // Replace 'any' with the actual user data type
}
//
const createJob = async (req: CustomRequest, res: Response) => {
  try {
    const middlewareUser = req.user;

    console.log(middlewareUser);

    const { title } = req.body;
    // Create a new user
    const newJob = new Job({
      //   createdBy: createdBy,
      createdBy: middlewareUser,
      title: title,
    });
    //
    // Save the user to the database
    const savedJob = await newJob.save();

    res.status(201).json({ job: savedJob });
  } catch (error) {
    res.status(400).json(error);
  }
};
//
const getAllJobs = async (req: Request, res: Response) => {
  try {
    // Use Mongoose to find all jobs and populate the 'createdBy' field to get user details
    const jobs = await Job.find().populate("createdBy", "username email"); // Replace 'username' and 'email' with the fields you want to include

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json(error);
  }
};
//
const applyJob = async (req: CustomRequest, res: Response) => {
  try {
    const jobId = req.params.jobId; // Get the job ID from the route parameters
    const userId = req.user._id; // Get the user ID from the middleware

    // Check if the user is an 'applicant'
    const user = await User.findOne({ _id: userId, userType: "applicant" });
    if (!user) {
      return res.status(403).json({ error: "Permission denied" });
    }

    // Check if the job has already been applied by the user
    const job = await Job.findOne({ _id: jobId, appliedBy: userId });
    if (job) {
      return res.status(400).json({ error: "Job already applied" });
    }

    // Find the job and add the user to the appliedBy array
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId },
      { $addToSet: { appliedBy: userId } }, // Use $addToSet to prevent duplicates
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Add the job ID to the user's appliedJobs array
    user.appliedJobs.push(updatedJob._id);
    await user.save();

    res.json({ message: "Job application successful", job: updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//

export { createJob, getAllJobs, applyJob };
