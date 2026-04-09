// getting id and querySelector from HTML
const progressPara = document.querySelector("[data-progress-summary]");
const progressPercent = document.querySelector("[data-progress-percent]");
const progressStatus = document.querySelector("[data-progress-status]");
const progressBar = document.querySelector(".progress-bar-line");

export const calculateProgress = (tasks = []) => {
    let doneTasks = 0;
    const totalTasks = tasks.length;

    tasks.forEach((task) => {
        if (task.done) {
            doneTasks += 1;
        }
    });

    return { totalTasks, doneTasks };
};

export const getProgressPercentage = (doneTasks, totalTasks) => {
    //if percent === 0 return 0 otherwise modulo of done and total task
    return totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
};

export const updateProgressContainer = (doneTasks, totalTasks) => {
    const percent = getProgressPercentage(doneTasks, totalTasks);
    const remainingTasks = totalTasks - doneTasks;

    if (progressPara) {
        progressPara.textContent = `${doneTasks} of ${totalTasks} tasks completed`;
    }

    if (progressPercent) {
        progressPercent.textContent = `${percent}%`;
    }

    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }

    if (!progressStatus) return;

    if (totalTasks === 0) {
        progressStatus.textContent = "Add your first task";
    } else if (remainingTasks === 0) {
        progressStatus.textContent = "All tasks completed";
    } else {
        progressStatus.textContent = `${remainingTasks} tasks left`;
    }
};
