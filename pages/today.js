// SELECT ELEMENTS FROM DOM

// Task elements
const newTaskContainer = document.querySelector(".task-list-container");
const taskInput = document.getElementById("newTaskInput");
const addNewTaskBtn = document.querySelector(".new-task-btn");
const warningMsg = document.getElementById("taskWarning");
const dateInput = document.getElementById("dateTimePicker");
const priorityInput = document.getElementById("priorityOptions");
// Progress elements
const currentFlowProgress = document.querySelector(".progress-percent");
const completedText = document.querySelector(".progress-para");
const progressBar = document.querySelector(".progress-bar-line");

//LOAD DATA FROM LOCAL STORAGE
const savedTasksData = JSON.parse(localStorage.getItem("savedData"));
const tasks = savedTasksData || [];

// SAVE DATA TO LOCAL STORAGE
const storageFunc = () => {
    localStorage.setItem("savedData", JSON.stringify(tasks));
};

//RENDER TASKS (DISPLAY UI)
const renderTask = () => {
    let newTaskRender = "";

    tasks.forEach((task, index) => {
        const time = new Date(task.taskDateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        newTaskRender += `
            <li class="task-list-item ${task.done ? "done" : ""}" data-index="${index}">
                <button class="task-list-btn" type="button" aria-label="Mark task as complete">
                    <span class="checked"><i class="fa-solid fa-check"></i></span>
                </button>
                <div class="task-list-text">
                    <h3 class="task-list-heading">${task.taskTitle}</h3>
                    <span class="task-list-date">
                        <i class="fa-solid fa-clock"></i> ${time}
                    </span>
                </div>
                <div class="task-list-right">
                    <div class="task-list-tags-parent">
                        <span class="task-list-tags-text">${task.taskPriority.charAt(0).toUpperCase() + task.taskPriority.slice(1)}</span>
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
    calculateProgress();
};

// ADD NEW TASK
const displayNewTask = () => {
    const newTaskValue = taskInput.value.trim();
    const newDateValue = dateInput.value.trim();
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
        taskDateTime: newDateValue,
        taskPriority: newPriorityValue,
        done: false,
    };

    // console.log(newPriorityValue);
    // Add to array
    tasks.push(newTask);
    // Save + render
    storageFunc();
    renderTask();

    // Reset inputs
    taskInput.value = "";
    dateInput.value = "";
    priorityInput.selectedIndex = 0;

};


//calculating and updating task progress
const calculateProgress = () => {
    //get how many tasks we got
    const totalTasks = tasks.length;
    // console.log(totalTasks); // 2 so far
    //then we get only done tasks from the array of tasks
    const doneTasks = tasks.filter((task) => task.done).length;
    console.log(doneTasks);

    updateProgressContainer(doneTasks, totalTasks);
};

//UPDATE PROGRESS UI
// we need 2 params doneTasks : how many task finished and totalTask : how many tasks in total.
const updateProgressContainer = (doneTasks, totalTasks) => {
    // Avoid division by 0
    const percent =
        totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    // Update text
    completedText.textContent = `${doneTasks} of ${totalTasks} tasks completed`;
    // Update percentage text
    currentFlowProgress.textContent = `${percent}%`;
    // Update progress bar width
    progressBar.style.width = `${percent}%`;
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
    const delBtnStyle = document.querySelector(".del-btn");

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
