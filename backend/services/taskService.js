import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../db/tasks.json");

const createTaskId = () => {
    return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeTask = (task = {}) => {
    return {
        id:
            typeof task.id === "string" && task.id.trim()
                ? task.id
                : createTaskId(),
        taskTitle: typeof task.taskTitle === "string" ? task.taskTitle : "",
        time: typeof task.time === "string" ? task.time : "",
        priority: typeof task.priority === "string" ? task.priority : "",
        taskType: typeof task.taskType === "string" ? task.taskType : "",
        completedAt:
            typeof task.completedAt === "string" ? task.completedAt : null,
        done: Boolean(task.done),
    };
};

export const readTasks = async () => {
    try {
        const file = await fs.readFile(filePath, "utf-8");
        const parsedTasks = JSON.parse(file);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        let shouldRewriteFile = false;
        const normalizedTasks = parsedTasks.map((task) => {
            const normalizedTask = normalizeTask(task);

            if (
                normalizedTask.id !== task?.id ||
                normalizedTask.done !== Boolean(task?.done) ||
                normalizedTask.completedAt !==
                    (typeof task?.completedAt === "string"
                        ? task.completedAt
                        : null)
            ) {
                shouldRewriteFile = true;
            }

            return normalizedTask;
        });

        if (shouldRewriteFile) {
            await writeTasks(normalizedTasks);
        }

        return normalizedTasks;
    } catch (err) {
        console.log("Error reading", err);
        return [];
    }
};

export const writeTasks = async (tasks) => {
    try {
        const stringFile = JSON.stringify(tasks, null, 2);
        await fs.writeFile(filePath, stringFile, "utf-8");
    } catch (err) {
        console.log('Error writing', err);
        throw err;
    }
};
