import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../db/users.json');

export const readUsersFile = async() => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.log("Error reading users", error);
    return [];
  }
}

export const writeUsersFile = async(users) => {
  const stringData = JSON.stringify(users, null, 2);
  await fs.writeFile(filePath, stringData, 'utf-8');
}



