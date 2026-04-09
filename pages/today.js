// SELECT ELEMENTS FROM DOM
import { calculateProgress, updateProgressContainer } from "../utils/progress.js";
import { storageFunc, tasks } from "../database/task.js";

// Task elements
const newTaskContainer = document.querySelector(".task-list-container");
const taskInput = document.getElementById("newTaskInput");
const addNewTaskBtn = document.querySelector(".new-task-btn");
const warningMsg = document.getElementById("taskWarning");
const timeInput = document.getElementById("timePicker");
const priorityInput = document.getElementById("priorityOptions");

const getPriorityLabel = (priority) => {
    if (!priority) {
        return "Unsorted";
    }

    return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const createIcon = (className) => {
    const icon = document.createElement("i");
    icon.className = className;
    return icon;
};

const createTaskItem = (task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task-list-item ${task.done ? "done" : ""}`.trim();
    taskItem.dataset.index = String(index);

    const taskButton = document.createElement("button");
    taskButton.className = "task-list-btn";
    taskButton.type = "button";
    taskButton.setAttribute("aria-label", "Mark task as complete");

    const checkedSpan = document.createElement("span");
    checkedSpan.className = "checked";
    checkedSpan.appendChild(createIcon("fa-solid fa-check"));
    taskButton.appendChild(checkedSpan);

    const taskText = document.createElement("div");
    taskText.className = "task-list-text";

    const heading = document.createElement("h3");
    heading.className = "task-list-heading";
    heading.textContent = task.taskTitle;

    const paragraph = document.createElement("p");
    paragraph.className = "task-list-para";
    paragraph.textContent = "Focus on the tonal architecture section.";

    const taskDate = document.createElement("span");
    taskDate.className = "task-list-date";
    taskDate.append(
        createIcon("fa-solid fa-clock"),
        document.createTextNode(` ${task.time || "No time set"}`),
    );

    taskText.append(heading, paragraph, taskDate);

    const taskRight = document.createElement("div");
    taskRight.className = "task-list-right";

    const tagsParent = document.createElement("div");
    tagsParent.className = "task-list-tags-parent";

    const tag = document.createElement("span");
    tag.className = "task-list-tags";
    tag.textContent = getPriorityLabel(task.priority);
    tagsParent.appendChild(tag);

    const deleteParent = document.createElement("div");
    deleteParent.className = "del-btn-parent";

    const deleteButton = document.createElement("button");
    deleteButton.className = "del-btn task-del-btn";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.appendChild(createIcon("fa-solid fa-trash"));
    deleteParent.appendChild(deleteButton);

    taskRight.append(tagsParent, deleteParent);
    taskItem.append(taskButton, taskText, taskRight);

    return taskItem;
};

//RENDER TASKS (DISPLAY UI)
const renderTask = () => {
    if (!newTaskContainer) {
        return;
    }

    newTaskContainer.replaceChildren(
        ...tasks.map((task, index) => createTaskItem(task, index)),
    );

    // update progress after rendering
    renderProgress();
};

const renderProgress = () => {
    const { doneTasks, totalTasks } = calculateProgress(tasks);

    updateProgressContainer(doneTasks, totalTasks);
};

// ADD NEW TASK
export const displayNewTask = () => {
    if (!taskInput || !timeInput || !priorityInput || !warningMsg) {
        return;
    }

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
if (newTaskContainer) {
    newTaskContainer.addEventListener("click", (event) => {
        //and we detect which child was clicked
        //"Go up from the clicked element until you find .task-list-btn"
        const btn = event.target.closest(".task-list-btn");
        //if not ignore click
        if (!btn) return;

        //Find the parent task item
        const taskItem = btn.closest(".task-list-item");

        if (!taskItem) return;

        //Get which task this is
        const index = Number(taskItem.dataset.index);

        if (!Number.isInteger(index) || !tasks[index]) return;

        //Toggle done/undone
        tasks[index].done = !tasks[index].done;
        //Save + re - render;
        storageFunc();
        renderTask();
    });

    //DELETE TASK (EVENT DELEGATION)
    newTaskContainer.addEventListener("click", (event) => {
        const deleteBtn = event.target.closest(".del-btn");

        if (!deleteBtn) return;

        const taskItem = event.target.closest(".task-list-item");

        if (!taskItem) return;

        const index = Number(taskItem.dataset.index);

        if (!Number.isInteger(index) || !tasks[index]) return;

        tasks.splice(index, 1);
        storageFunc();
        renderTask();
    });
}

//ADD TASK BUTTON
if (addNewTaskBtn) {
    addNewTaskBtn.addEventListener("click", displayNewTask);
}

//NITIAL RENDER ON LOAD
renderTask();
