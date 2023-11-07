import { Request, Response } from "express";
import { Job } from "../models/Job";

//
const createJob = async (req: Request, res: Response) => {
  try {
    const { createdBy, title } = req.body;
    // Create a new user
    const newJob = new Job({
      createdBy: createdBy,
      title: title,
    });
    //
    // Save the user to the database
    const savedJob = await newJob.save();
    //
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

export { createJob, getAllJobs };