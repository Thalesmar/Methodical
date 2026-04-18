import { tasks } from "../utils/taskStorage.js";
import { escapeHtml } from "../utils/escapeHtml.js";

const personalRoutineParent = document.querySelector(".routine-grid");
const personalFocusParent = document.querySelector(".focus-card-container");

const isPersonalTask = (task) => {
    return task.priority.trim().toLowerCase() === "personal";
};

const getTaskTypeTasks = (taskType) => {
    return tasks.filter((task) => {
        return isPersonalTask(task) && task.taskType === taskType;
    });
};

const renderPersonalRoutineTasks = () => {
    if (!personalRoutineParent) return;

    const routineTasks = getTaskTypeTasks("Routine");

    if (routineTasks.length === 0) {
        personalRoutineParent.innerHTML = `
            <div class="routine-card routine-card-null">
                <h3>No routine tasks yet</h3>
                <p>Add a personal routine on the Today page and it will show up here.</p>
            </div>`;
        return;
    }

    let routineHtml = "";

    routineTasks.forEach((task) => {
        const taskTitle = escapeHtml(task.taskTitle || "Untitled task");
        const taskPriority = escapeHtml(task.priority || "No priority");
        const taskTime = escapeHtml(task.time || "No time set");

        routineHtml += `
            <div class="routine-card">
                <span class="routine-time">${taskTime}</span>
                <h3>${taskTitle}</h3>
                <span class="item">${taskPriority}</span>
                <p>Stay consistent with this personal routine block and avoid distractions.</p>
            </div>`;
    });

    personalRoutineParent.innerHTML = routineHtml;
};

const renderPersonalFocusTasks = () => {
    if (!personalFocusParent) return;

    const focusTasks = getTaskTypeTasks("Focus");

    if (focusTasks.length === 0) {
        personalFocusParent.innerHTML = `
            <p class="personal-empty-state">
                Add a personal focus task on the Today page and it will show up here.
            </p>`;
        return;
    }

    let focusHtml = `<ul class="personal-list">`;

    focusTasks.forEach((task) => {
        const taskTitle = escapeHtml(task.taskTitle || "Untitled task");
        const taskTime = escapeHtml(task.time || "No time set");

        focusHtml += `
            <li class="personal-list-item">
                <span class="list-dot" aria-hidden="true"></span>
                <div class="personal-item-copy">
                    <h3>${taskTitle}</h3>
                    <p>${taskTime}</p>
                </div>
                <span class="item-tag">Personal</span>
            </li>`;
    });

    focusHtml += `</ul>`;
    personalFocusParent.innerHTML = focusHtml;
};

renderPersonalRoutineTasks();
renderPersonalFocusTasks();
