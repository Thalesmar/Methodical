const API_BASE_URL = "http://localhost:8000/api";

const getJson = async (response, fallbackMessage) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }

    return data;
};

export const fetchUserProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`);
    const data = await getJson(response, "Failed to load profile");

    return data.profile || null;
};

export const updateUserProfile = async (displayName) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName }),
    });

    return getJson(response, "Failed to update profile");
};
