// SELECT ELEMENTS FROM DOM
import { calculateProgress, updateProgressContainer } from "../utils/progress.js";

// Task elements
const newTaskContainer = document.querySelector(".task-list-container");
const taskInput = document.getElementById("newTaskInput");
const addNewTaskBtn = document.querySelector(".new-task-btn");
const warningMsg = document.getElementById("taskWarning");
const timeInput = document.getElementById("timePicker");
const priorityInput = document.getElementById("priorityOptions");

//LOAD DATA FROM LOCAL STORAGE
const savedTasksData = JSON.parse(localStorage.getItem("savedInputsData") || "[]");
const tasks = Array.isArray(savedTasksData) ? savedTasksData : [];

// SAVE DATA TO LOCAL STORAGE
const storageFunc = () => {
    localStorage.setItem("savedInputsData", JSON.stringify(tasks));
};

//RENDER TASKS (DISPLAY UI)
const renderTask = () => {
    let newTaskRender = "";

    tasks.forEach((task, index) => {
        const time = task.time || "No time set";

        newTaskRender += `
            <li class="task-list-item ${task.done ? "done" : ""}" data-index="${index}">
                <button class="task-list-btn" type="button" aria-label="Mark task as complete">
                    <span class="checked"><i class="fa-solid fa-check"></i></span>
                </button>
                <div class="task-list-text">
                    <h3 class="task-list-heading">${task.taskTitle}</h3>
                    <p class="task-list-para">Focus on the tonal architecture section.</p>
                    <span class="task-list-date">
                        <i class="fa-solid fa-clock"></i> ${time}
                    </span>
                </div>
                <div class="task-list-right">
                    <div class="task-list-tags-parent">
                        <span class="task-list-tags">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    </div>
                    <div class="del-btn-parent">
                        <button class="del-btn task-del-btn" type="button" aria-label="Delete task"><i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </li>`;
    });

    newTaskContainer.innerHTML = newTaskRender;
    // update progress after rendering
    renderProgress();
};

const renderProgress = () => {
    const { doneTasks, totalTasks } = calculateProgress(tasks);

    updateProgressContainer(doneTasks, totalTasks);
};

// ADD NEW TASK
export const displayNewTask = () => {
    const newTaskValue = taskInput.value.trim();
    const newTimeValue = timeInput.value.trim();
    const newPriorityValue = priorityInput.value.trim();

    // Validation of data
    if (!newTaskValue || !newPriorityValue) {
        warningMsg.textContent = "Add a task and select a priority";
        warningMsg.classList.add("task-warning-text");

        setTimeout(() => {
            warningMsg.textContent = "";
            warningMsg.classList.remove("task-warning-text");
        }, 3000);

        return;
    }

    // Create new task object
    const newTask = {
        taskTitle: newTaskValue,
        time: newTimeValue,
        priority: newPriorityValue,
        done: false,
    };

    // Add to array
    tasks.push(newTask);
    // Save + render
    storageFunc();
    renderTask();

    // Reset inputs
    taskInput.value = "";
    timeInput.value = "";
    priorityInput.selectedIndex = 0;
};

// EVENT DELEGATION (DONE BUTTON)
//we listen to the parent
newTaskContainer.addEventListener("click", (event) => {
    //and we detect which child was clicked
    //"Go up from the clicked element until you find .task-list-btn"
    const btn = event.target.closest(".task-list-btn");
    //if not ignore click
    if (!btn) return;

    //Find the parent task item
    const taskItem = btn.closest(".task-list-item");
    //Get which task this is
    const index = taskItem.dataset.index;

    //Toggle done/undone
    tasks[index].done = !tasks[index].done;
    //Save + re - render;
    storageFunc();
    renderTask();
});
//ADD TASK BUTTON
addNewTaskBtn.addEventListener("click", displayNewTask);

//DELETE TASK (EVENT DELEGATION)
newTaskContainer.addEventListener("click", (event) => {
    const taskItem = event.target.closest(".task-list-item");
    if (!taskItem) return;

    const index = taskItem.dataset.index;

    const deleteBtn = event.target.closest(".del-btn");

    if (deleteBtn) {
        tasks.splice(index, 1);
        storageFunc();
        renderTask();
    }

    //Save + re - render;
});

//NITIAL RENDER ON LOAD
renderTask();
