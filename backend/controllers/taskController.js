import { readTasks, writeTasks } from "../services/taskService.js";

const createTaskId = () => {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const getTasks = async (req, res) => {
  try {
    const tasksData = await readTasks();

    res.status(200).json({
      tasksData,
      message: "Showing all tasks",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load tasks" });
  }
};

export const addTasks = async (req, res) => {
  try {
    const { taskTitle, time, priority, taskType } = req.body;
    const trimmedTaskTitle = typeof taskTitle === "string" ? taskTitle.trim() : "";
    const trimmedPriority = typeof priority === "string" ? priority.trim().toLowerCase() : "";
    const trimmedTaskType = typeof taskType === "string" ? taskType.trim() : "";

    if (!trimmedTaskTitle || !trimmedPriority || !trimmedTaskType) {
      return res.status(400).json({
        message: "Task title, priority and task type are required",
      });
    }

    const tasksData = await readTasks();
    const taskExist = tasksData.find((task) => {
      return task.taskTitle.trim().toLowerCase() === trimmedTaskTitle.toLowerCase();
    });

    if (taskExist) {
      return res.status(409).json({
        message: "Task already exists! Create new one",
      });
    }

    const newTask = {
      id: createTaskId(),
      taskTitle: trimmedTaskTitle,
      time: typeof time === "string" ? time : "",
      priority: trimmedPriority,
      taskType: trimmedTaskType,
      completedAt: null,
      done: false,
    };

    tasksData.push(newTask);
    await writeTasks(tasksData);

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { done, completedAt, taskTitle, time, priority, taskType } = req.body;
    const tasksData = await readTasks();
    const taskIndex = tasksData.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    const currentTask = tasksData[taskIndex];
    const updatedTask = {
      ...currentTask,
      done: typeof done === "boolean" ? done : currentTask.done,
      completedAt:
        completedAt === null || typeof completedAt === "string"
          ? completedAt
          : currentTask.completedAt,
      taskTitle: typeof taskTitle === "string" ? taskTitle : currentTask.taskTitle,
      time: typeof time === "string" ? time : currentTask.time,
      priority: typeof priority === "string" ? priority : currentTask.priority,
      taskType: typeof taskType === "string" ? taskType : currentTask.taskType,
    };

    tasksData[taskIndex] = updatedTask;
    await writeTasks(tasksData);

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const tasksData = await readTasks();
    const remainingTasks = tasksData.filter((task) => task.id !== taskId);

    if (remainingTasks.length === tasksData.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    await writeTasks(remainingTasks);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
