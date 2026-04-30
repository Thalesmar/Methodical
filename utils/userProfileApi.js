const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080/api`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please sign in before updating your profile");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

const getJson = async (response, fallbackMessage) => {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
        }
        const message = isJson
            ? (await response.json()).message
            : fallbackMessage;
        throw new Error(message || fallbackMessage);
    }

    if (!isJson) {
        throw new Error(fallbackMessage);
    }

    return response.json();
};

export const fetchUserProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeaders(),
    });
    const data = await getJson(response, "Failed to load profile");

    return data.profile || null;
};

export const updateUserProfile = async (displayName) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName }),
    });

    return getJson(response, "Failed to update profile");
};
