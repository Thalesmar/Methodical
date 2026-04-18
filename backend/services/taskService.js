import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../db/tasks.json");

export const readTasks = async () => {
    try {
        const file = await fs.readFile(filePath, "utf-8");
        return JSON.parse(file);
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
