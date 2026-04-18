import { tasks } from "../utils/taskStorage.js";
import { escapeHtml } from "../utils/escapeHtml.js";

const workRoutineParent = document.querySelector(".routine-grid");
const workFocusParent = document.querySelector(".focus-card-container");

const isWorkTask = (task) => {
    return task.priority.trim().toLowerCase() === "work";
};

const getTaskTypeTasks = (taskType) => {
    return tasks.filter((task) => {
        return isWorkTask(task) && task.taskType === taskType;
    });
};

const renderWorkRoutineTasks = () => {
    if (!workRoutineParent) return;

    const routineTasks = getTaskTypeTasks("Routine");

    if (routineTasks.length === 0) {
        workRoutineParent.innerHTML = `
            <div class="routine-card routine-card-null">
                <h3>No work routines yet</h3>
                <p>Add a work routine on the Today page and it will show up here.</p>
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
                <p>Stay consistent with this work routine block and keep momentum steady.</p>
            </div>`;
    });

    workRoutineParent.innerHTML = routineHtml;
};

const renderWorkFocusTasks = () => {
    if (!workFocusParent) return;

    const focusTasks = getTaskTypeTasks("Focus");

    if (focusTasks.length === 0) {
        workFocusParent.innerHTML = `
            <p class="personal-empty-state">
                Add a work focus task on the Today page and it will show up here.
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
                <span class="item-tag">Work</span>
            </li>`;
    });

    focusHtml += `</ul>`;
    workFocusParent.innerHTML = focusHtml;
};

renderWorkRoutineTasks();
renderWorkFocusTasks();
