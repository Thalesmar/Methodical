import {
    fetchUserProfile,
    updateUserProfile,
} from "../utils/userProfileApi.js";

const userProfileInput = document.getElementById("userNameInput");
const submitButton = document.getElementById("submitBtn");
const userNameMsg = document.getElementById("userNameMsg");

const showUserMessage = (message, isError = false) => {
    if (!userNameMsg) return;

    userNameMsg.classList.remove("userNameMsgDone-none");
    userNameMsg.textContent = message;
    userNameMsg.style.color = isError ? "#b42318" : "";

    setTimeout(() => {
        userNameMsg.classList.add("userNameMsgDone-none");
        userNameMsg.style.color = "";
    }, 5000);
};

const loadUserProfile = async () => {
    if (!userProfileInput) return;

    try {
        const profile = await fetchUserProfile();
        userProfileInput.value = profile?.displayName || "";
    } catch (error) {
        console.log("Error:", error);
    }
};

const getUserProfileData = async () => {
    if (!userProfileInput || !userNameMsg) return;

    const userInputValue = userProfileInput.value.trim();

    if (!userInputValue) {
        showUserMessage("Display name is required", true);
        return;
    }

    try {
        const data = await updateUserProfile(userInputValue);
        console.log("Backend response:", data);
        showUserMessage(data.message || "Username has been added successfully");
        userProfileInput.value = data.profile?.displayName || userInputValue;
    } catch (error) {
        console.log("Error:", error);
        showUserMessage(error.message || "Failed to save display name", true);
    }
};

if (submitButton) {
    submitButton.addEventListener("click", getUserProfileData);
}

await loadUserProfile();
