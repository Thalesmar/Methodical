import express from "express";
import { readUsers, writeUsers } from "../services/userService.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

const findUserFromToken = (users, tokenUser) => {
    return users.find((user) => {
        return user.username === tokenUser.username || user.email === tokenUser.email;
    });
};

const toSafeProfile = (user) => {
    if (!user) return null;

    const { password, ...safeProfile } = user;
    return safeProfile;
};

userRouter.get("/profile", verifyToken, async (req, res) => {
    try {
        const users = await readUsers();
        const profile = findUserFromToken(users, req.user);

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        res.status(200).json({
            profile: toSafeProfile(profile),
            message: "Profile loaded successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to load profile",
        });
    }
});

userRouter.put("/profile", verifyToken, async (req, res) => {
    try {
        const { displayName } = req.body;

        if (!displayName || !displayName.trim()) {
            return res.status(400).json({
                message: "Display name is required",
            });
        }

        const users = await readUsers();
        const trimmedDisplayName = displayName.trim();
        const userIndex = users.findIndex((user) => {
            return user.username === req.user.username || user.email === req.user.email;
        });

        if (userIndex === -1) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        users[userIndex] = {
            ...users[userIndex],
            displayName: trimmedDisplayName,
        };

        await writeUsers(users);

        res.status(200).json({
            message: "Profile updated successfully",
            profile: toSafeProfile(users[userIndex]),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

export default userRouter;
