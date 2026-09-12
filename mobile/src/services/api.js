const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

function getApiUrl() {
    if (!API_BASE_URL) {
        throw new Error("EXPO_PUBLIC_API_URL is missing");
    }

    return API_BASE_URL;
}

async function request(path, options = {}) {
    const response = await fetch(`${getApiUrl()}${path}`, options);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur serveur");
    }

    return data;
}

async function getTrip(params) {
    const query = new URLSearchParams(params).toString();

    return request(`/trip?${query}`);
}

async function compareDestinations(params) {
    const query = new URLSearchParams(params).toString();

    return request(`/compare?${query}`);
}

async function getMe(token) {
    return request("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

async function login(email, password) {
    return request("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
}

async function register(firstName, lastName, email, password, country, currency) {
    return request("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            country,
            currency
        })
    });
}

async function saveTrip(token, tripData) {
    return request("/my-trips", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
    });
}

async function getMyTrips(token) {
    return request("/my-trips", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

async function deleteTrip(token, tripId) {
    return request(`/my-trips/${tripId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

function getFileNameFromUri(uri) {
    return uri.split("/").pop() || `avatar-${Date.now()}.jpg`;
}

function getMimeTypeFromFileName(fileName) {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (extension === "png") {
        return "image/png";
    }

    if (extension === "webp") {
        return "image/webp";
    }

    if (extension === "jpg" || extension === "jpeg") {
        return "image/jpeg";
    }

    return "image/jpeg";
}

async function uploadAvatar(token, asset) {
    const fileName =
        asset.fileName ||
        getFileNameFromUri(asset.uri);

    const mimeType =
        asset.mimeType ||
        getMimeTypeFromFileName(fileName);

    const formData = new FormData();

    formData.append("avatar", {
        uri: asset.uri,
        name: fileName,
        type: mimeType
    });

    return request("/auth/me/avatar", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
}

module.exports = {
    getTrip,
    compareDestinations,
    login,
    register,
    getMe,
    saveTrip,
    getMyTrips,
    deleteTrip,
    getApiUrl,
    uploadAvatar
};