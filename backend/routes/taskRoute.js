import express from "express";
import {
    addTasks,
    deleteTask,
    getTasks,
    updateTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", getTasks);
taskRouter.post("/", addTasks);
taskRouter.patch("/:taskId", updateTask);
taskRouter.delete("/:taskId", deleteTask);

export default taskRouter;
