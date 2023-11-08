import { Request, Response } from "express";
import { Job } from "../models/Job";
import { User } from "../models/User";
//
interface CustomRequest extends Request {
  //as no question mark - was the reason of error
  user?: any; // Replace 'any' with the actual user data type
}
//
// for all auth type
const getAllJobs = async (req: Request, res: Response) => {
  try {
    // Use Mongoose to find all jobs and populate the 'createdBy' field to get user details
    const jobs = await Job.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 }); // Replace 'username' and 'email' with the fields you want to include

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json(error);
  }
};
// for jobcreator only
const createJob = async (req: CustomRequest, res: Response) => {
  try {
    const middlewareUser = req.user;

    console.log(middlewareUser);

    const { title, description } = req.body;
    // Create a new user
    const newJob = new Job({
      //   createdBy: createdBy,
      createdBy: middlewareUser,
      title: title,
      description: description,
    });
    //
    // Save the user to the database
    const savedJob = await newJob.save();

    res.status(201).json({ job: savedJob });
  } catch (error: any) {
    if (error && error.code == 11000) {
      return res.status(403).json();
    }

    res.status(500).json(error);
  }
};
// for jobcreator only
const allAppliedUserDetail = async (req: CustomRequest, res: Response) => {
  try {
    const jobId = req.params.jobId; // Get the job ID from the route parameters

    // Find the job by ID and populate the appliedBy array with only cvUrl and email
    const job = await Job.findOne({ _id: jobId }).populate({
      path: "appliedBy",
      select: "cvUrl email -_id", // Include only 'cvUrl' and 'email' fields and exclude the '_id' field
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job.appliedBy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//
const getYourCreatedJobs = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const jobs = await Job.find({ createdBy: userId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json(error);
  }
};

// for applicant only
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

    res
      .status(201)
      .json({ message: "Job application successful" /*job: updatedJob*/ });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// for applicant only
const allAppliedJobs = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id; // Get the user ID from the middleware

    // Find the user by ID and populate the appliedJobs array with job titles
    const user = await User.findOne({ _id: userId }).populate({
      path: "appliedJobs",
      select: "title description",
      populate: {
        path: "createdBy",
        select: "email -_id", // Include only the 'email' field of createdBy and exclude the '_id' field
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.appliedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//

//

export {
  createJob,
  getAllJobs,
  applyJob,
  allAppliedJobs,
  allAppliedUserDetail,
  getYourCreatedJobs,
};
