import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../db/users.json");

const normalizeUser = (user = {}, index = 0) => {
    return {
        id:
            typeof user.id === "number" || typeof user.id === "string"
                ? user.id
                : index + 1,
        name: typeof user.name === "string" ? user.name : "",
        age: typeof user.age === "number" ? user.age : null,
        displayName:
            typeof user.displayName === "string" ? user.displayName : "",
    };
};

export const readUsers = async () => {
    try {
        const file = await fs.readFile(filePath, "utf-8");
        const parsedUsers = JSON.parse(file);

        if (!Array.isArray(parsedUsers)) {
            return [];
        }

        return parsedUsers.map(normalizeUser);
    } catch (error) {
        console.log("Error reading users", error);
        return [];
    }
};

export const writeUsers = async (users) => {
    try {
        const stringFile = JSON.stringify(users, null, 2);
        await fs.writeFile(filePath, stringFile, "utf-8");
    } catch (error) {
        console.log("Error writing users", error);
        throw error;
    }
};
