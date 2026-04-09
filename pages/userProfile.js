const userProfileInput = document.getElementById("userProfileInput");
const submitButton = document.getElementById("submitBtn");
const userNameMsg = document.getElementById("userNameMsg");

const getUserProfileData = () => {
    if (!userProfileInput) return;

    const userInputValue = userProfileInput.value.trim();

    if (!userInputValue) return;

    if (userInputValue) {
        userNameMsg.textContent = `UserName has been added successful`;
        
        setTimeout(() => {
            userNameMsg.classList.add("userNameMsgDone-none");
        }, 5000);
    }

        localStorage.setItem("username", userInputValue);
};

if (submitButton) {
    submitButton.addEventListener("click", getUserProfileData);
}
