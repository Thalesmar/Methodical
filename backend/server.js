import express from "express";
import cors from "cors";
import taskRouter from "./routes/taskRoute.js";
import userRouter from "./routes/userRoute.js";
import dotenv from "dotenv";
dotenv.config();

//create a server with express
const app = express();

const PORT = process.env.MAIN_PORT || 8080;

//Body parser middleware
app.use(express.json());
app.use(cors());

app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Listening to PORT: ${PORT}`));
