import { calculateProgress, getProgressPercentage } from "./utils/progress.js";
import { getRecentTask } from "./utils/recent.js";
import { getCompletedStreak } from "./utils/streak.js";
import { fetchUserProfile } from "./utils/userProfileApi.js";
import { fetchTasks } from "./utils/tasksApi.js";

const MOBILE_BREAKPOINT = 878;

const sideBar = document.querySelector(".side-bar");
const menuToggle = document.querySelector(".menu-toggle");
const homePercent = document.querySelector(".home-percent");
const trackPercentage = document.querySelector(".track-percentage");
const userName = document.querySelector(".heading-right-part");
const logoTrack = document.querySelector(".logo-track");
const displayProfile = document.querySelector(".profile");
const authLinks = document.querySelector(".auth");

let overlay = document.querySelector(".sidebar-overlay");

const renderStreak = document.querySelector(".hero-cards .card-heading");

if (!overlay) {
    overlay = document.createElement("button");
    overlay.type = "button";
    overlay.className = "sidebar-overlay";
    overlay.setAttribute("aria-label", "Close navigation");
    overlay.setAttribute("aria-hidden", "true");
    overlay.tabIndex = -1;
    document.body.appendChild(overlay);
}

const isMobileViewport = () => {
    return window.innerWidth <= MOBILE_BREAKPOINT;
};

const setSidebarState = (isOpen) => {
    if (!sideBar || !menuToggle || !overlay) return;

    const shouldOpen = isMobileViewport() && isOpen;

    document.body.classList.toggle("nav-open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.setAttribute(
        "aria-label",
        shouldOpen ? "Close navigation" : "Open navigation",
    );

    sideBar.setAttribute("aria-hidden", String(isMobileViewport() && !shouldOpen));
    overlay.setAttribute("aria-hidden", String(!shouldOpen));
};

const syncCurrentPageState = () => {
    const currentPage = document.body.dataset.currentPage;
    const pageItems = document.querySelectorAll("[data-page-key]");

    pageItems.forEach((item) => {
        const isCurrent = item.dataset.pageKey === currentPage;

        item.classList.toggle("active", isCurrent);

        if (isCurrent) {
            item.setAttribute("aria-current", "page");
        } else {
            item.removeAttribute("aria-current");
        }
    });
};

const formatDate = (date, variant) => {
    let formatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };

    if (variant === "short") {
        formatOptions = {
            month: "short",
            day: "numeric",
        };
    }

    return new Intl.DateTimeFormat(undefined, formatOptions).format(date);
};

const updateDateLabels = () => {
    const today = new Date();
    const currentDateElements = document.querySelectorAll("[data-current-date]");
    const futureDateElements = document.querySelectorAll("[data-future-date]");

    currentDateElements.forEach((element) => {
        const variant = element.dataset.currentDate || "long";
        element.textContent = formatDate(today, variant);

        if (element.tagName === "TIME") {
            element.dateTime = today.toISOString().split("T")[0];
        }
    });

    futureDateElements.forEach((element) => {
        const offsetDays = Number(element.dataset.futureDate || 0);
        const timeLabel = element.dataset.timeLabel
            ? element.dataset.timeLabel.trim()
            : "";
        const futureDate = new Date(today);

        futureDate.setDate(today.getDate() + offsetDays);

        const formattedDate = formatDate(futureDate, "long");

        if (timeLabel) {
            element.textContent = `${formattedDate}, ${timeLabel}`;
        } else {
            element.textContent = formattedDate;
        }

        if (element.tagName === "TIME") {
            element.dateTime = futureDate.toISOString().split("T")[0];
        }
    });
};

const renderHomeProgressData = (tasks) => {
    const { doneTasks, totalTasks } = calculateProgress(tasks);
    const percent = getProgressPercentage(doneTasks, totalTasks);

    if (homePercent) {
        homePercent.textContent = `${percent}%`;
    }

    if (trackPercentage) {
        trackPercentage.style.width = `${percent}%`;
    }
};

const renderUserProfileName = async () => {
    if (!userName) return;

    try {
        const profile = await fetchUserProfile();
        const displayName = profile?.displayName?.trim();

        userName.textContent = displayName || "User";
    } catch (error) {
        console.log(error);
        userName.textContent = "User";
    }
};

const duplicateLogoTrack = () => {
    if (!logoTrack || logoTrack.dataset.ready === "true") return;

    const logoItems = Array.from(logoTrack.children);

    logoItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        logoTrack.appendChild(clone);
    });

    logoTrack.dataset.ready = "true";
};

if (menuToggle && sideBar && overlay) {
    menuToggle.addEventListener("click", () => {
        if (!isMobileViewport()) return;

        const isOpen = document.body.classList.contains("nav-open");
        setSidebarState(!isOpen);
    });

    overlay.addEventListener("click", () => {
        setSidebarState(false);
    });

    sideBar.addEventListener("click", (event) => {
        const clickedItem = event.target.closest("a, button");

        if (!clickedItem || !isMobileViewport()) return;

        setSidebarState(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setSidebarState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (!isMobileViewport()) {
            setSidebarState(false);
            sideBar.setAttribute("aria-hidden", "false");
            return;
        }

        sideBar.setAttribute(
            "aria-hidden",
            String(!document.body.classList.contains("nav-open")),
        );
    });
}

const renderFocusStreak = (tasks) => {
    if (!renderStreak) return;

    const streak = getCompletedStreak(tasks);
    const dayLabel = streak === 1 ? "Day" : "Days";

    renderStreak.textContent = `${streak} ${dayLabel}`;
};

const syncAuthState = () => {
    const isLoggedIn = Boolean(localStorage.getItem("token"));

    if (authLinks) {
        authLinks.hidden = isLoggedIn;
    }

    if (displayProfile) {
        displayProfile.hidden = !isLoggedIn;
    }
};

const initDashboardData = async () => {
    const needsTaskStats = homePercent || trackPercentage || renderStreak;
    const needsRecentTasks = document.querySelector(".activity-list-parent");
    let tasks = null;

    try {
        if (needsTaskStats || needsRecentTasks) {
            tasks = await fetchTasks();
        }

        if (tasks && needsTaskStats) {
            renderHomeProgressData(tasks);
            renderFocusStreak(tasks);
        }
    } catch (error) {
        console.log(error);

        if (homePercent) {
            homePercent.textContent = "0%";
        }

        if (trackPercentage) {
            trackPercentage.style.width = "0%";
        }

        if (renderStreak) {
            renderStreak.textContent = "0 Days";
        }
    }

    const pageJobs = [];

    if (needsRecentTasks) {
        pageJobs.push(getRecentTask(tasks));
    }

    if (userName && localStorage.getItem("token")) {
        pageJobs.push(renderUserProfileName());
    }

    await Promise.all(pageJobs);
};

syncCurrentPageState();
syncAuthState();
updateDateLabels();
setSidebarState(false);
duplicateLogoTrack();
await initDashboardData();
// updateUI();
