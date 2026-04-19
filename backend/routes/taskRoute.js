import express from "express";
import { randomUUID } from "crypto";
import { readTasks, writeTasks } from "../services/taskService.js";

const taskRouter = express.Router();

taskRouter.get("/", async (req, res) => {
    try {
        const tasksData = await readTasks();
        res.status(200).json({
            tasksData,
            message: "Showing all tasks",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to load tasks",
        });
    }
});

taskRouter.post("/", async (req, res) => {
    try {
        const { taskTitle, time, priority, taskType } = req.body;

        if (!taskTitle || !priority || !taskType) {
            res.status(400).json({
                message: "Task title, priority and task type are required",
            });
            return;
        }

        const newTaskData = {
            id: `task-${randomUUID()}`,
            taskTitle,
            time,
            priority,
            taskType,
            completedAt: null,
            done: false,
        };

        const tasksData = await readTasks();

        tasksData.push(newTaskData);
        await writeTasks(tasksData);

        res.status(201).json({
            message: "New task created successfully",
            task: newTaskData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

taskRouter.patch("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const { done, completedAt, taskTitle, time, priority, taskType } = req.body;
        const tasksData = await readTasks();
        const taskIndex = tasksData.findIndex((task) => task.id === taskId);

        if (taskIndex === -1) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }

        const currentTask = tasksData[taskIndex];
        const updatedTask = {
            ...currentTask,
            done: typeof done === "boolean" ? done : currentTask.done,
            completedAt:
                completedAt === null || typeof completedAt === "string"
                    ? completedAt
                    : currentTask.completedAt,
            taskTitle:
                typeof taskTitle === "string" ? taskTitle : currentTask.taskTitle,
            time: typeof time === "string" ? time : currentTask.time,
            priority:
                typeof priority === "string" ? priority : currentTask.priority,
            taskType:
                typeof taskType === "string" ? taskType : currentTask.taskType,
        };

        tasksData[taskIndex] = updatedTask;
        await writeTasks(tasksData);

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

taskRouter.delete("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const tasksData = await readTasks();
        const remainingTasks = tasksData.filter((task) => task.id !== taskId);

        if (remainingTasks.length === tasksData.length) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }

        await writeTasks(remainingTasks);

        res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

export default taskRouter;
