import { escapeHtml } from "./escapeHtml.js";
import { fetchTasks } from "./tasksApi.js";

const activityListParent = document.querySelector(".activity-list-parent");

export const getRecentTask = async (tasksFromPage = null) => {
    if (!activityListParent) return;

    try {
        const tasks = tasksFromPage || await fetchTasks();
        const recentTasks = tasks.slice(-3).reverse();
        let html = "";

        recentTasks.forEach((task) => {
            const taskTitle = escapeHtml(task.taskTitle || "Untitled task");
            const taskTime = escapeHtml(task.time || "No time set");

            html += `
                <li class="activity-list">
                    <div class="activity-dots green"></div>
                    <div class="activity-info">
                        <p class="activity-list-para">${taskTitle}</p>
                        <p class="activity-list-description">${taskTime}</p>
                    </div>
                </li>`;
        });

        activityListParent.innerHTML =
            html || `<li class="activity-list"><p>No recent tasks yet.</p></li>`;
    } catch (error) {
        console.log(error);
        activityListParent.innerHTML =
            `<li class="activity-list"><p>Unable to load recent tasks.</p></li>`;
    }
};
