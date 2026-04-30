const passwordInput = document.getElementById("passwordInput");
const usernameInput = document.getElementById("usernameInput");
const signinForm = document.querySelector(".signin-form");
const signInButton = document.getElementById("signInBtn");

const showError = (message) => {
  window.alert(message);
};

const setLoading = (isLoading) => {
  if (!signInButton) return;

  signInButton.disabled = isLoading;
  signInButton.textContent = isLoading ? "Signing in..." : "Sign in";
};

const handleSignIn = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const passwordInputValue = passwordInput.value.trim();
    const usernameInputValue = usernameInput.value.trim();

    if (!passwordInputValue || !usernameInputValue) {
      showError("All fields required");
      setLoading(false);
      return;
    }

    const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInputValue,
        password: passwordInputValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || "Sign in failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    usernameInput.value = "";
    passwordInput.value = "";
    window.location.href = "../index.html";
  } catch (error) {
    console.log(error);
    showError("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};

if (signinForm) {
  signinForm.addEventListener("submit", handleSignIn);
}
