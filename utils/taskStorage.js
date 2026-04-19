const API_BASE_URL = "http://localhost:8000/api";

const getJson = async (response, fallbackMessage) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }

    return data;
};

const normalizeTask = (task = {}) => {
    return {
        id: typeof task.id === "string" ? task.id : "",
        taskTitle: typeof task.taskTitle === "string" ? task.taskTitle : "",
        time: typeof task.time === "string" ? task.time : "",
        priority: typeof task.priority === "string" ? task.priority : "",
        taskType: typeof task.taskType === "string" ? task.taskType : "",
        completedAt:
            typeof task.completedAt === "string" ? task.completedAt : null,
        done: Boolean(task.done),
    };
};

export const fetchTasks = async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const data = await getJson(response, "Failed to load tasks");

    return Array.isArray(data.tasksData)
        ? data.tasksData.map(normalizeTask)
        : [];
};

export const createTask = async (task) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });

    return getJson(response, "Failed to create task");
};

export const updateTask = async (taskId, updates) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    return getJson(response, "Failed to update task");
};

export const deleteTask = async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
    });

    return getJson(response, "Failed to delete task");
};
