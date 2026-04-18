// SELECT ELEMENTS FROM DOM
import { calculateProgress, updateProgressContainer } from "../utils/progress.js";
// import { storageFunc, tasks } from "../utils/taskStorage.js";
import { escapeHtml } from "../utils/escapeHtml.js";
import { getLocalDateString } from "../utils/streak.js";
// import { error } from "node:console";

const newTaskContainer = document.querySelector(".task-list-container");
const taskInput = document.getElementById("newTaskInput");
const addNewTaskBtn = document.querySelector(".new-task-btn");
const warningMsg = document.getElementById("taskWarning");
const timeInput = document.getElementById("timePicker");
const priorityInput = document.getElementById("priorityOptions");
const tasksTypeInput = document.getElementById("tasksTypeInput");

// RENDER TASKS (DISPLAY UI)

const tasks = [];
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

const renderProgress = () => {
    const { doneTasks, totalTasks } = calculateProgress(tasks);

    updateProgressContainer(doneTasks, totalTasks);
};

const loadTask = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/tasks");
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to load tasks");
        }

        //empty the arr
        tasks.length = 0;
        tasks.push(...data.tasksData);
        renderTask();
    } catch (error) {
        console.log(error);
    }
}

// ADD NEW TASK
export const displayNewTask = async() => {
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
        warningMsg.textContent = "Add a task, priority and task type";
        warningMsg.classList.add("task-warning-text");

        setTimeout(() => {
            warningMsg.textContent = "";
            warningMsg.classList.remove("task-warning-text");
        }, 3000);

        return;
    }

    //fetching data from backend
    try {
        const response = await fetch("http://localhost:8000/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                taskTitle: newTaskValue,
                time: newTimeValue,
                priority: newPriorityValue,
                taskType: tasksTypeInputValue,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            warningMsg.textContent = data.message;
            return;
        }
        warningMsg.textContent = data.message;
    } catch (error) {
        console.log(error);
    }

    //useless local update after adding backend
    // const newTask = {
    //     taskTitle: newTaskValue,
    //     time: newTimeValue,
    //     priority: newPriorityValue,
    //     taskType: tasksTypeInputValue,
    //     completedAt: null,
    //     done: false,
    // };

    // tasks.push(newTask);
    // storageFunc();
    // renderTask();

    taskInput.value = "";
    timeInput.value = "";
    priorityInput.selectedIndex = 0;
    tasksTypeInput.selectedIndex = 0;

    await loadTask();
};

// EVENT DELEGATION (DONE BUTTON)
if (newTaskContainer) {
    newTaskContainer.addEventListener("click", (event) => {
        const btn = event.target.closest(".task-list-btn");
        if (!btn) return;

        const taskItem = btn.closest(".task-list-item");
        if (!taskItem) return;

        const index = Number(taskItem.dataset.index);
        if (!Number.isInteger(index) || !tasks[index]) return;

        tasks[index].done = !tasks[index].done;

        if (tasks[index].done) {
            tasks[index].completedAt = getLocalDateString();
        } else {
            tasks[index].completedAt = null;
        }

        // storageFunc();
        renderTask();
    });

    // DELETE TASK (EVENT DELEGATION)
    newTaskContainer.addEventListener("click", (event) => {
        const taskItem = event.target.closest(".task-list-item");
        if (!taskItem) return;

        const index = Number(taskItem.dataset.index);
        const deleteBtn = event.target.closest(".del-btn");

        if (!deleteBtn || !Number.isInteger(index) || !tasks[index]) return;

        tasks.splice(index, 1);
        // storageFunc();
        renderTask();
    });
}

// ADD TASK BUTTON
if (addNewTaskBtn) {
    addNewTaskBtn.addEventListener("click", displayNewTask);
}

// INITIAL RENDER ON LOAD
renderTask();
await loadTask();
