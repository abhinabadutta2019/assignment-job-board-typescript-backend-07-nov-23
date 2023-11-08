// import { Job } from "../models/Job";
import { Router } from "express";
const router = Router();
//
import { verifyJobCreator } from "../middleware/verifyJobCreator";
//
import { verifyJWT } from "../middleware/verifyJWT";
//
import {
  createJob,
  getAllJobs,
  applyJob,
  allAppliedJobs,
  allAppliedUserDetail,
  getYourCreatedJobs,
} from "../controllers/jobController";

// for jobcreator only
router.post("/", verifyJobCreator, createJob);
// for jobcreator only
router.get("/appliedUsers/:jobId", verifyJobCreator, allAppliedUserDetail);
//
// for jobcreator only
router.get("/yourCreatedJobs/:jobId", verifyJobCreator, getYourCreatedJobs);

//for all auth user
router.get("/", verifyJWT, getAllJobs);
// for applicant only
router.post("/apply/:jobId", verifyJWT, applyJob);
// for applicant only
router.get("/appliedJobs", verifyJWT, allAppliedJobs);
//

export { router as jobRouter };
