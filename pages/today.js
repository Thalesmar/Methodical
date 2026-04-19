import { calculateProgress, updateProgressContainer } from "../utils/progress.js";
import {
    createTask,
    deleteTask,
    fetchTasks,
    updateTask,
} from "../utils/taskStorage.js";
import { escapeHtml } from "../utils/escapeHtml.js";
import { getLocalDateString } from "../utils/streak.js";

const newTaskContainer = document.querySelector(".task-list-container");
const taskInput = document.getElementById("newTaskInput");
const addNewTaskBtn = document.querySelector(".new-task-btn");
const warningMsg = document.getElementById("taskWarning");
const timeInput = document.getElementById("timePicker");
const priorityInput = document.getElementById("priorityOptions");
const tasksTypeInput = document.getElementById("tasksTypeInput");

const tasks = [];

const showMessage = (message, shouldHighlight = false) => {
    if (!warningMsg) return;

    warningMsg.textContent = message;
    warningMsg.classList.toggle("task-warning-text", shouldHighlight);
};

const renderProgress = () => {
    const { doneTasks, totalTasks } = calculateProgress(tasks);
    updateProgressContainer(doneTasks, totalTasks);
};

const renderTask = () => {
    if (!newTaskContainer) return;

    let newTaskRender = "";

    tasks.forEach((task, index) => {
        const taskTitle = escapeHtml(task.taskTitle || "Untitled task");
        const time = escapeHtml(task.time || "No time set");
        const priority = task.priority
            ? escapeHtml(
                  task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
              )
            : "Unsorted";
        const taskType = escapeHtml(task.taskType || "No task type");

        newTaskRender += `
            <li class="task-list-item ${task.done ? "done" : ""}" data-index="${index}">
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
                        <button class="del-btn task-del-btn" type="button" aria-label="Delete task"><i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </li>`;
    });

    newTaskContainer.innerHTML = newTaskRender;
    renderProgress();
};

const loadTask = async () => {
    try {
        const fetchedTasks = await fetchTasks();
        tasks.length = 0;
        tasks.push(...fetchedTasks);
        renderTask();
    } catch (error) {
        console.log(error);
        showMessage(error.message || "Failed to load tasks", true);
    }
};

export const displayNewTask = async () => {
    if (
        !taskInput ||
        !timeInput ||
        !priorityInput ||
        !tasksTypeInput ||
        !warningMsg
    ) {
        return;
    }

    const newTaskValue = taskInput.value.trim();
    const newTimeValue = timeInput.value.trim();
    const newPriorityValue = priorityInput.value.trim();
    const tasksTypeInputValue = tasksTypeInput.value.trim();

    if (!newTaskValue || !newPriorityValue || !tasksTypeInputValue) {
        showMessage("Add a task, priority and task type", true);

        setTimeout(() => {
            showMessage("", false);
        }, 3000);

        return;
    }

    try {
        const data = await createTask({
            taskTitle: newTaskValue,
            time: newTimeValue,
            priority: newPriorityValue,
            taskType: tasksTypeInputValue,
        });

        showMessage(data.message || "Task created successfully");

        taskInput.value = "";
        timeInput.value = "";
        priorityInput.selectedIndex = 0;
        tasksTypeInput.selectedIndex = 0;

        await loadTask();
    } catch (error) {
        console.log(error);
        showMessage(error.message || "Failed to create task", true);
    }
};

if (newTaskContainer) {
    newTaskContainer.addEventListener("click", async (event) => {
        const btn = event.target.closest(".task-list-btn");
        if (!btn) return;

        const taskItem = btn.closest(".task-list-item");
        if (!taskItem) return;

        const index = Number(taskItem.dataset.index);
        const task = Number.isInteger(index) ? tasks[index] : null;

        if (!task?.id) return;

        const nextDoneState = !task.done;

        try {
            await updateTask(task.id, {
                done: nextDoneState,
                completedAt: nextDoneState ? getLocalDateString() : null,
            });

            await loadTask();
        } catch (error) {
            console.log(error);
            showMessage(error.message || "Failed to update task", true);
        }
    });

    newTaskContainer.addEventListener("click", async (event) => {
        const taskItem = event.target.closest(".task-list-item");
        if (!taskItem) return;

        const deleteBtn = event.target.closest(".del-btn");
        if (!deleteBtn) return;

        const index = Number(taskItem.dataset.index);
        const task = Number.isInteger(index) ? tasks[index] : null;

        if (!task?.id) return;

        try {
            const data = await deleteTask(task.id);
            showMessage(data.message || "Task deleted successfully");
            await loadTask();
        } catch (error) {
            console.log(error);
            showMessage(error.message || "Failed to delete task", true);
        }
    });
}

if (addNewTaskBtn) {
    addNewTaskBtn.addEventListener("click", displayNewTask);
}

renderTask();
await loadTask();
