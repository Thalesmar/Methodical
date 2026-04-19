import express from "express";
import { readUsers, writeUsers } from "../services/userService.js";

const userRouter = express.Router();

userRouter.get("/profile", async (req, res) => {
    try {
        const users = await readUsers();
        const profile = users[0] || null;

        res.status(200).json({
            profile,
            message: "Profile loaded successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to load profile",
        });
    }
});

userRouter.put("/profile", async (req, res) => {
    try {
        const { displayName } = req.body;

        if (!displayName || !displayName.trim()) {
            res.status(400).json({
                message: "Display name is required",
            });
            return;
        }

        const users = await readUsers();
        const trimmedDisplayName = displayName.trim();

        if (users.length === 0) {
            users.push({
                id: 1,
                name: "",
                age: null,
                displayName: trimmedDisplayName,
            });
        } else {
            users[0] = {
                ...users[0],
                displayName: trimmedDisplayName,
            };
        }

        await writeUsers(users);

        res.status(200).json({
            message: "Profile updated successfully",
            profile: users[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

export default userRouter;
