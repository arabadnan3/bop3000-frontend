const API_BASE_URL = 'http://localhost:8080/api';

// Helper function
async function handleResponse(response) {

    let data = null;

    // Handle endpoints that return JSON
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    }

    if (!response.ok) {
        const error = new Error(
            data?.message || `Request failed with status ${response.status}`
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}

export const api = {

    // DASHBOARD PAGE

    getBuildings: async () => {
        const response = await fetch(`${API_BASE_URL}/buildings`);
        return handleResponse(response);
    },

    getRoomsFromBuilding: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/building/${buildingId}`);
        return handleResponse(response);
    },

    getRoomDetails: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/details/${roomId}`);
        return handleResponse(response);
    },

    getSensorsFromRoom: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/rooms/${roomId}`);
        return handleResponse(response);
    },

    getLatestReading: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings/latest/${sensorId}`);
        return handleResponse(response);
    },

    getSensorReadingsFrom24Hours: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings/aggregated/${sensorId}`);
        return handleResponse(response);
    },

    // SENSORS PAGE

    getBuildingCards: async () => {
        const response = await fetch(`${API_BASE_URL}/buildings/building_cards`);
        return handleResponse(response);
    },

    getSensorCards: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/sensor_cards/${buildingId}`);
        return handleResponse(response);
    },

    getSensorDetails: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/details/${sensorId}`);
        return handleResponse(response);
    },

    // SETTINGS PAGE

    createBuilding: async (buildingData) => {
        const response = await fetch(`${API_BASE_URL}/buildings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(buildingData),
        });

        return handleResponse(response);
    },

    updateBuilding: async (updatedBuildingData) => {
        const response = await fetch(`${API_BASE_URL}/buildings/${updatedBuildingData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBuildingData),
        });

        return handleResponse(response);
    },

    createSensor: async (sensorData) => {
        const response = await fetch(`${API_BASE_URL}/sensors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sensorData)
        });

        return handleResponse(response);
    },

    getSensorsAndDetails: async () => {
        const response = await fetch(`${API_BASE_URL}/sensors/buildings/details`);
        return handleResponse(response);
    },

    getSensorDetailsByBuilding: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/buildings/details/${buildingId}`);
        return handleResponse(response);
    },

    updateSensor: async (updatedSensorData) => {
        const response = await fetch(`${API_BASE_URL}/sensors/${updatedSensorData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSensorData),
        });

        return handleResponse(response);
    },

    updateSensorStatus: async (updatedSensorStatus) => {
        const response = await fetch(`${API_BASE_URL}/sensors/active/${updatedSensorStatus.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSensorStatus)
        });

        return handleResponse(response);
    },

    // WARNINGS PAGE

    getAllSensorAlertCards: async () => {
        const response = await fetch(`${API_BASE_URL}/sensor_alerts/alert_cards`);
        return handleResponse(response);
    },

    resolveAnAlert: async (alertId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_alerts/resolve/${alertId}`);
        return handleResponse(response);
    },
};