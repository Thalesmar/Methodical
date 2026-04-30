const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const usernameInput = document.getElementById("usernameInput");
const signupForm = document.querySelector(".signup-form");
const createButton = document.getElementById("createBtn");

const setLoading = (isLoading) => {
  if (!createButton) return;

  createButton.disabled = isLoading;
  createButton.textContent = isLoading ? "Creating..." : "Create account";
};

const handleSignUp = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const emailInputValue = emailInput.value.trim();
    const passwordInputValue = passwordInput.value.trim();
    const usernameInputValue = usernameInput.value.trim();

    if (!emailInputValue || !passwordInputValue || !usernameInputValue) {
      window.alert("All fields required");
      setLoading(false);
      return;
    }

    const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInputValue,
        password: passwordInputValue,
        username: usernameInputValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return window.alert(data.message);
    }

    emailInput.value = "";
    passwordInput.value = "";
    usernameInput.value = "";
    window.location.href = "./signIn.html";
  } catch (error) {
    console.log(error);
    window.alert("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};

if (signupForm) {
  signupForm.addEventListener("submit", handleSignUp);
}
