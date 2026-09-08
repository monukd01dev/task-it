import express from "express";
import healthRouter from "../../modules/health/health.routes";
import authRouter from "../../modules/auth/auth.routes";
import taskRouter from "../../modules/tasks/task.routes";
const v1Router = express.Router();

v1Router.use(healthRouter)
v1Router.use(authRouter)
v1Router.use(taskRouter)


export default v1Router