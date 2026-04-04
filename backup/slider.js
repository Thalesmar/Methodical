// function initLogoSlider() {
//     const tracks = document.querySelectorAll(".logo-track");

//     tracks.forEach((track) => {
//         if (track.dataset.sliderReady === "true") {
//             return;
//         }

//         const logos = Array.from(track.children);

//         logos.forEach((logo) => {
//             const clone = logo.cloneNode(true);
//             clone.setAttribute("aria-hidden", "true");
//             track.appendChild(clone);
//         });

//         track.dataset.sliderReady = "true";
//         track.classList.add("is-ready");
//     });
// }

// if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", initLogoSlider, { once: true });
// } else {
//     initLogoSlider();
// }
