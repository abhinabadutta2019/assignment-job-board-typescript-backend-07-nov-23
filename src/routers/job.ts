// import { Job } from "../models/Job";
import { Router } from "express";
const router = Router();
//
import { verifyJobCreator } from "../middleware/verifyJobCreator";
//
import { createJob, getAllJobs } from "../controllers/jobController";

//
router.post("/", verifyJobCreator, createJob);
router.get("/", getAllJobs);
//

export { router as jobRouter };
