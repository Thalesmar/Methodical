const userProfileInput = document.getElementById("userProfileInput");
const submitButton = document.getElementById("submitBtn");


const getUserProfileData = () => {
    const userInputValue = userProfileInput.value.trim();

    if (!userInputValue) {
        return;
    }
    localStorage.setItem("username", userInputValue);
};

submitButton.addEventListener("click", getUserProfileData);
