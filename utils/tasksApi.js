const API_URL = `${window.location.protocol}//${window.location.hostname}:8080/api/tasks`;

export const normalizeTask = (task = {}) => {
    return {
        id: task.id || String(task.taskId || ""),
        taskTitle: task.taskTitle || "",
        time: task.time || "",
        priority: task.priority || "",
        taskType: task.taskType || "",
        completedAt: task.completedAt || null,
        done: Boolean(task.done),
    };
};

export const getJson = async (response, fallbackMessage) => {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
        const message = isJson
            ? (await response.json()).message
            : fallbackMessage;
        throw new Error(message || fallbackMessage);
    }

    if (!isJson) {
        throw new Error(fallbackMessage);
    }

    return response.json();
};

export const fetchTasks = async () => {
    const response = await fetch(API_URL);
    const data = await getJson(response, "Failed to load tasks");

    if (!Array.isArray(data.tasksData)) {
        return [];
    }

    return data.tasksData.map(normalizeTask);
};

export const createTask = async ({ taskTitle, time, priority, taskType }) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            taskTitle,
            time,
            priority,
            taskType,
        }),
    });

    return getJson(response, "Failed to create task");
};

export const updateTask = async (taskId, updates) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    return getJson(response, "Failed to update task");
};

export const deleteTaskById = async (taskId) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
    });

    return getJson(response, "Failed to delete task");
};
