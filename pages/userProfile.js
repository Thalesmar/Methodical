const userProfileInput = document.getElementById("userNameInput");
const submitButton = document.getElementById("submitBtn");
const userNameMsg = document.getElementById("userNameMsg");

const getUserProfileData = async () => {
    if (!userProfileInput || !userNameMsg) return;

    const userInputValue = userProfileInput.value.trim();

    if (!userInputValue) return;

    try {
        const response = await fetch(
            "http://localhost:5000/api/users/profile",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ displayName: userInputValue }),
            },
        );

        const data = await response.json();

        console.log("Backend response:", data);
        alert(data.message);
    } catch (error) {
        console.log("Error:", error);
    }

    // UI feedback
    userNameMsg.classList.remove("userNameMsgDone-none");
    userNameMsg.textContent = `UserName has been added successfully`;

    setTimeout(() => {
        userNameMsg.classList.add("userNameMsgDone-none");
    }, 5000);

    localStorage.setItem("username", userInputValue);
};

if (submitButton) {
    submitButton.addEventListener("click", getUserProfileData);
}
