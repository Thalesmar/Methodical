const sideBar = document.querySelector(".side-bar");
const menuToggle = document.querySelector(".menu-toggle");

const handleSideBarBtn = () => {
    sideBar.classList.toggle('side-bar-mobile-style');
    // sideBar.classList.add("side-bar-mobile-style");
}

menuToggle.addEventListener("click", handleSideBarBtn);
