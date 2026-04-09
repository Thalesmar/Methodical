const STORAGE_KEY = "savedInputsData";

const normalizeTask = (task) => {
    const safeTask = task && typeof task === "object" ? task : {};

    return {
        taskTitle:
            typeof safeTask.taskTitle === "string" ? safeTask.taskTitle : "",
        time: typeof safeTask.time === "string" ? safeTask.time : "",
        priority:
            typeof safeTask.priority === "string" ? safeTask.priority : "",
        done: Boolean(safeTask.done),
    };
};

const loadTasks = () => {
    try {
        const rawTasks = localStorage.getItem(STORAGE_KEY);

        if (!rawTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(rawTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.map(normalizeTask);
    } catch (error) {
        console.warn("Unable to read saved tasks from localStorage.", error);
        return [];
    }
};

export const tasks = loadTasks();

export const storageFunc = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
