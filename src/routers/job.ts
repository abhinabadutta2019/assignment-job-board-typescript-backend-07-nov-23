// import { Job } from "../models/Job";
import { Router } from "express";
const router = Router();
//
import { createJob, getAllJobs } from "../controllers/jobController";

//
router.post("/", createJob);
router.get("/", getAllJobs);
//

export { router as jobRouter };
