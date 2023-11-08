// import { Job } from "../models/Job";
import { Router } from "express";
const router = Router();
//
import { verifyJobCreator } from "../middleware/verifyJobCreator";
//
import { verifyJWT } from "../middleware/verifyJWT";
//
import { createJob, getAllJobs, applyJob } from "../controllers/jobController";

//
router.post("/", verifyJobCreator, createJob);
router.get("/", verifyJWT, getAllJobs);
router.post("/apply/:jobId", verifyJWT, applyJob);
//

export { router as jobRouter };
