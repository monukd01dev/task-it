import express from "express";
import { healthCheck } from "./health.controller";
const healthRouter = express.Router();


healthRouter.get('/health', healthCheck)

export default healthRouter;