const MOBILE_BREAKPOINT = 808;

function isMobileViewport() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

function getOverlay() {
    let overlay = document.querySelector(".sidebar-overlay");

    if (!overlay) {
        overlay = document.createElement("button");
        overlay.type = "button";
        overlay.className = "sidebar-overlay";
        overlay.setAttribute("aria-label", "Close navigation");
        overlay.tabIndex = -1;
        document.body.appendChild(overlay);
    }

    return overlay;
}

function getNavigationElements() {
    return {
        sideBar: document.querySelector(".side-bar"),
        menuToggle: document.querySelector(".menu-toggle"),
        overlay: getOverlay(),
    };
}

function setSidebarState(isOpen, elements) {
    const { sideBar, menuToggle, overlay } = elements;

    if (!sideBar || !menuToggle) {
        return;
    }

    const shouldOpen = isMobileViewport() && isOpen;

    document.body.classList.toggle("nav-open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.setAttribute(
        "aria-label",
        shouldOpen ? "Close navigation" : "Open navigation",
    );

    sideBar.setAttribute("aria-hidden", String(isMobileViewport() && !shouldOpen));
    overlay.setAttribute("aria-hidden", String(!shouldOpen));
}

function closeSidebar(elements) {
    setSidebarState(false, elements);
}

function toggleSidebar(elements) {
    const isOpen = document.body.classList.contains("nav-open");
    setSidebarState(!isOpen, elements);
}

function syncCurrentPageState() {
    const currentPage = document.body.dataset.currentPage;
    const pageItems = document.querySelectorAll("[data-page-key]");

    if (!currentPage || pageItems.length === 0) {
        return;
    }

    pageItems.forEach((item) => {
        const isCurrent = item.dataset.pageKey === currentPage;
        item.classList.toggle("active", isCurrent);

        if (isCurrent) {
            item.setAttribute("aria-current", "page");
        } else {
            item.removeAttribute("aria-current");
        }
    });
}

function formatDate(date, variant) {
    const formatMap = {
        long: { weekday: "long", month: "long", day: "numeric" },
        short: { month: "short", day: "numeric" },
    };

    return new Intl.DateTimeFormat(undefined, formatMap[variant] || formatMap.long).format(date);
}

function updateDateLabels() {
    const today = new Date();

    document.querySelectorAll("[data-current-date]").forEach((element) => {
        const variant = element.dataset.currentDate || "long";
        element.textContent = formatDate(today, variant);

        if (element.tagName === "TIME") {
            element.dateTime = today.toISOString().split("T")[0];
        }
    });

    document.querySelectorAll("[data-future-date]").forEach((element) => {
        const offsetDays = Number(element.dataset.futureDate || "0");
        const timeLabel = element.dataset.timeLabel?.trim();
        const futureDate = new Date(today);

        futureDate.setDate(today.getDate() + offsetDays);

        const formattedDate = formatDate(futureDate, "long");
        element.textContent = timeLabel ? `${formattedDate}, ${timeLabel}` : formattedDate;

        if (element.tagName === "TIME") {
            element.dateTime = futureDate.toISOString().split("T")[0];
        }
    });
}

function setupSidebarInteractions() {
    const elements = getNavigationElements();
    const { sideBar, menuToggle, overlay } = elements;

    if (!sideBar || !menuToggle) {
        return;
    }

    menuToggle.addEventListener("click", () => {
        if (!isMobileViewport()) {
            return;
        }

        toggleSidebar(elements);
    });

    overlay.addEventListener("click", () => closeSidebar(elements));

    sideBar.addEventListener("click", (event) => {
        const clickedItem = event.target.closest("a, button");

        if (!clickedItem || !isMobileViewport()) {
            return;
        }

        closeSidebar(elements);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar(elements);
        }
    });

    window.addEventListener("resize", () => {
        if (!isMobileViewport()) {
            closeSidebar(elements);
            sideBar.setAttribute("aria-hidden", "false");
            return;
        }

        sideBar.setAttribute(
            "aria-hidden",
            String(!document.body.classList.contains("nav-open")),
        );
    });

    setSidebarState(false, elements);
}

function initApp() {
    syncCurrentPageState();
    updateDateLabels();
    setupSidebarInteractions();
}

initApp();
