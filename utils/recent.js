import { tasks } from "../database/task.js";

const activityListParent = document.querySelector(".activity-list-parent");

const createRecentTaskItem = (task) => {
    const activityItem = document.createElement("li");
    activityItem.className = "activity-list";

    const activityDot = document.createElement("div");
    activityDot.className = "activity-dots green";

    const activityInfo = document.createElement("div");
    activityInfo.className = "activity-info";

    const title = document.createElement("p");
    title.className = "activity-list-para";
    title.textContent = task.taskTitle;

    const description = document.createElement("p");
    description.className = "activity-list-description";
    description.textContent = task.time || "No time set";

    activityInfo.append(title, description);
    activityItem.append(activityDot, activityInfo);

    return activityItem;
};

export const getRecentTask = () => {
    if (!activityListParent) {
        return;
    }

    activityListParent.replaceChildren(
        ...tasks.slice(-3).reverse().map((task) => createRecentTaskItem(task)),
    );
};
