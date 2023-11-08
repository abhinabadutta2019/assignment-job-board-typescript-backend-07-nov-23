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
} from "../controllers/jobController";

//
router.post("/", verifyJobCreator, createJob);
router.get("/", verifyJWT, getAllJobs);
// for applicant only
router.post("/apply/:jobId", verifyJWT, applyJob);
// for applicant only
router.get("/appliedJobs", verifyJWT, allAppliedJobs);
//

export { router as jobRouter };
