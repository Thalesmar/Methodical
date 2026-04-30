import express from "express";
import cors from "cors";
import taskRouter from "./routes/taskRoute.js";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

//create a server with express
const app = express();

const PORT = process.env.MAIN_PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "..");

//Body parser middleware
app.use(express.json());
const ALLOWED_ORIGINS = [
    process.env.ALLOWED_ORIGIN,
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));


app.use("/api/users", userRouter);
app.use('/api/auth', authRouter);
app.use("/api/tasks", taskRouter);

app.use(express.static(frontendPath));

app.listen(PORT, () => console.log(`Server running in: ${PORT}`));
