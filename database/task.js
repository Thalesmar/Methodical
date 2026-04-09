const STORAGE_KEY = "savedInputsData";

const normalizeTask = (task) => {
    const safeTask = task && typeof task === "object" ? task : {};

    return {
        taskTitle:
            typeof safeTask.taskTitle === "string" ? safeTask.taskTitle : "",
        time: typeof safeTask.time === "string" ? safeTask.time : "",
        priority:
            typeof safeTask.priority === "string" ? safeTask.priority : "",
        taskType:
            typeof safeTask.taskType === "string" ? safeTask.taskType : "",
        done: Boolean(safeTask.done),
    };
};

let savedTasksData = [];

try {
    savedTasksData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch {
    savedTasksData = [];
}

export const tasks = Array.isArray(savedTasksData)
    ? savedTasksData.map(normalizeTask)
    : [];

export const storageFunc = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
