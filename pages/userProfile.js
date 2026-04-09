const userProfileInput = document.getElementById("userProfileInput");
const submitButton = document.getElementById("submitBtn");

const getUserProfileData = () => {
    if (!userProfileInput) return;

    const userInputValue = userProfileInput.value.trim();

    if (!userInputValue) return;

    localStorage.setItem("username", userInputValue);
};

if (submitButton) {
    submitButton.addEventListener("click", getUserProfileData);
}
