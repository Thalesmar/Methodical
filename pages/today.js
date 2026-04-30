import { calculateProgress, updateProgressContainer } from "../utils/progress.js";
import { escapeHtml } from "../utils/escapeHtml.js";
import { getLocalDateString } from "../utils/streak.js";
import {
    createTask,
    deleteTaskById,
    fetchTasks,
    normalizeTask,
    updateTask,
} from "../utils/tasksApi.js";

const newTaskContainer = document.querySelector(".task-list-container");
const taskInput = document.getElementById("newTaskInput");
const addNewTaskBtn = document.querySelector(".new-task-btn");
const addTaskForm = document.querySelector(".task-tags-btn");
const warningMsg = document.getElementById("taskWarning");
const timeInput = document.getElementById("timePicker");
const priorityInput = document.getElementById("priorityOptions");
const tasksTypeInput = document.getElementById("tasksTypeInput");

let tasks = [];

const showMessage = (message, isError = false) => {
    if (!warningMsg) return;
    warningMsg.textContent = message;
    warningMsg.classList.toggle("task-warning-text", isError);
};

const renderProgress = () => {
    const { doneTasks, totalTasks } = calculateProgress(tasks);
    updateProgressContainer(doneTasks, totalTasks);
};

const renderTask = () => {
    if (!newTaskContainer) return;

    if (tasks.length === 0) {
        newTaskContainer.innerHTML = `
            <li class="task-list-empty-state">
                <p class="task-list-empty-title">No tasks yet</p>
                <p class="task-list-empty-copy">Add your first task above to get started.</p>
            </li>`;
        renderProgress();
        return;
    }

    let taskHtml = "";

    tasks.forEach((task) => {
        const taskTitle = escapeHtml(task.taskTitle || "Untitled task");
        const time = escapeHtml(task.time || "No time set");
        const taskType = escapeHtml(task.taskType || "No task type");
        const priority = task.priority
            ? escapeHtml(task.priority.charAt(0).toUpperCase() + task.priority.slice(1))
            : "Unsorted";

        taskHtml += `
            <li class="task-list-item ${task.done ? "done" : ""}" data-id="${task.id}">
                <button class="task-list-btn" type="button" aria-label="Mark task as complete">
                    <span class="checked"><i class="fa-solid fa-check"></i></span>
                </button>
                <div class="task-list-text">
                    <h3 class="task-list-heading">${taskTitle}</h3>
                    <p class="task-list-para">${taskType}</p>
                    <span class="task-list-date">
                        <i class="fa-solid fa-clock"></i> ${time}
                    </span>
                </div>
                <div class="task-list-right">
                    <div class="task-list-tags-parent">
                        <span class="task-list-tags">${priority}</span>
                    </div>
                    <div class="del-btn-parent">
                        <button class="del-btn task-del-btn" type="button" aria-label="Delete task">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </li>`;
    });

    newTaskContainer.innerHTML = taskHtml;
    renderProgress();
};

const loadTasks = async () => {
    try {
        tasks = await fetchTasks();
        renderTask();
    } catch (error) {
        console.log(error);
        showMessage(error.message || "Failed to load tasks", true);
    }
};

const clearForm = () => {
    taskInput.value = "";
    timeInput.value = "";
    priorityInput.selectedIndex = 0;
    tasksTypeInput.selectedIndex = 0;
};

export const displayNewTask = async (event) => {
    if (event) event.preventDefault();

    const taskTitle = taskInput.value.trim();
    const time = timeInput.value.trim();
    const priority = priorityInput.value.trim();
    const taskType = tasksTypeInput.value.trim();

    if (!taskTitle || !priority || !taskType) {
        showMessage("Add a task, priority and task type", true);
        return;
    }

    const previousTasks = [...tasks];

    try {
        const data = await createTask({ taskTitle, time, priority, taskType });

        clearForm();
        showMessage(data.message || "Task created successfully");

        if (data.task) {
            tasks = [...tasks, normalizeTask(data.task)];
        } else {
            tasks = await fetchTasks();
        }
        renderTask();
    } catch (error) {
        console.log(error);
        tasks = previousTasks;
        renderTask();
        showMessage(error.message || "Failed to create task", true);
    }
};

const updateTaskDone = async (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    const previousTasks = [...tasks];
    const nextDoneValue = !task.done;

    // Optimistic update
    tasks = tasks.map((item) =>
        item.id === taskId ? { ...item, done: nextDoneValue } : item
    );
    renderTask();

    try {
        const data = await updateTask(taskId, {
            done: nextDoneValue,
            completedAt: nextDoneValue ? getLocalDateString() : null,
        });

        if (data.task) {
            tasks = tasks.map((item) =>
                item.id === taskId ? normalizeTask(data.task) : item
            );
            renderTask();
        }
    } catch (error) {
        console.log(error);
        tasks = previousTasks;
        renderTask();
        showMessage(error.message || "Failed to update task", true);
    }
};

const deleteTask = async (taskId) => {
    const previousTasks = [...tasks];

    // Optimistic update
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTask();

    try {
        const data = await deleteTaskById(taskId);
        showMessage(data.message || "Task deleted successfully");
    } catch (error) {
        console.log(error);
        tasks = previousTasks;
        renderTask();
        showMessage(error.message || "Failed to delete task", true);
    }
};

if (addTaskForm) {
    addTaskForm.addEventListener("submit", displayNewTask);
} else if (addNewTaskBtn) {
    addNewTaskBtn.addEventListener("click", displayNewTask);
}

if (newTaskContainer) {
    newTaskContainer.addEventListener("click", (event) => {
        const taskItem = event.target.closest(".task-list-item");
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;
        if (!taskId) return;

        if (event.target.closest(".task-list-btn")) {
            updateTaskDone(taskId);
            return;
        }

        if (event.target.closest(".del-btn")) {
            deleteTask(taskId);
        }
    });
}

loadTasks();
