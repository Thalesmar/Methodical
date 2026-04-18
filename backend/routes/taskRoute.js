import express from "express";
import path from "path";
import url from "url";
import { readTasks, writeTasks } from "../services/taskService.js";

const taskRouter = express.Router();

taskRouter.get('/', async(req, res) => {
    try {
        const tasksData = await readTasks();
        res.status(200).json({
            tasksData,
            message : 'Showing All Tasks'
        });
    } catch (error) {
        console.log(error);
    }
});

taskRouter.post('/', async (req, res) => {
    try {
        const { taskTitle, time, priority, taskType } = req.body;

        // if (!taskTitle) {
        //     res.status(400).json({
        //         message: 'Task title is required',
        //     });
        // }
        const newTaskData = {
            taskTitle,
            time,
            priority,
            taskType,
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

export default taskRouter;
