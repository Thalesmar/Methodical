import express from "express";
import { loadData, signUp, signIn } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

//authentication routing
authRouter.get('/users', loadData);
authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/profile', verifyToken, (req, res) => {
  res.json(req.user);
});

export default authRouter;
