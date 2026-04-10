export const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const getCompletedStreak = (tasks = []) => {
    const completedDates = new Set(
        tasks
            .filter((task) => task?.done && typeof task.completedAt === "string")
            .map((task) => task.completedAt),
    );

    let streak = 0;
    const currentDate = new Date();

    while (completedDates.has(getLocalDateString(currentDate))) {
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
};
