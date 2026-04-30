import {
    fetchUserProfile,
    updateUserProfile,
} from "../utils/userProfileApi.js";

const userProfileInput = document.getElementById("userNameInput");
const userEmailInput = document.getElementById("userEmailInput");
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
        if (userEmailInput) {
            userEmailInput.value = profile?.email || "";
        }
    } catch (error) {
        showUserMessage(error.message || "Please sign in to view your profile", true);
    }
};

const getUserProfileData = async () => {
    if (!userProfileInput || !userNameMsg || !submitButton) return;

    const userInputValue = userProfileInput.value.trim();

    if (!userInputValue) {
        showUserMessage("Display name is required", true);
        return;
    }

    try {
        submitButton.disabled = true;
        const data = await updateUserProfile(userInputValue);
        showUserMessage(data.message || "Username has been added successfully");
        userProfileInput.value = data.profile?.displayName || userInputValue;
    } catch (error) {
        showUserMessage(error.message || "Failed to save display name", true);
    } finally {
        submitButton.disabled = false;
    }
};

if (submitButton) {
    submitButton.addEventListener("click", getUserProfileData);
}

await loadUserProfile();
