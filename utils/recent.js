import { tasks } from "../database/task.js";
import { escapeHtml } from "./escapeHtml.js";

const activityListParent = document.querySelector(".activity-list-parent");

export const getRecentTask = () => {
    if (!activityListParent) return;

    let html = "";
    const recentTasks = tasks.slice(-3).reverse();

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

    activityListParent.innerHTML = html;
};
