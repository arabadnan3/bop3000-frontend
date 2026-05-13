const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    getBuildings: async () => {
        const response = await fetch(`${API_BASE_URL}/buildings`);
        return response.json();
    },

    getRoomsFromBuilding: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/building/${buildingId}`);
        return response.json();
    },

    getRoomDetails: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/details/${roomId}`);
        return response.json();
    },

    getSensorsFromRoom: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/rooms/${roomId}`);
        return response.json();
    },

    getBuildingCards: async () => {
        const response = await fetch(`${API_BASE_URL}/buildings/building_cards`);
        return response.json();
    },

    getRoomCards: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/room_cards/${buildingId}`);
        return response.json();
    },

    getSensorDetails: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/details/${sensorId}`);
        return response.json();
    },

    getSensorReadingsFrom24Hours: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings/aggregated/${sensorId}`);
        return response.json();
    },

    getLatestReading: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings/latest/${sensorId}`);
        return response.json();
    },

    getSensorReadingsBySensor: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings/sensors/${sensorId}`);
        return response.json();
    },

    createBuilding: async (buildingData) => {
        const response = await fetch(`${API_BASE_URL}/buildings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(buildingData),
        });

        if (!response.ok) {
            throw new Error("Failed to create building");
        }

        return await response.json();
    },

    updateBuilding: async (updatedBuildingData) => {
        const response = await fetch(`${API_BASE_URL}/buildings/${updatedBuildingData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBuildingData),
        });

        if (!response.ok) {
            throw new Error("Failed to update building");
        }
    },

    createSensor: async (sensorData) => {
        const response = await fetch(`${API_BASE_URL}/sensors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sensorData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create sensor: ${errorText}`);
        }

        return await response.json();
    },

    getSensorsAndDetails: async () => {
        const response = await fetch(`${API_BASE_URL}/sensors/buildings/details`);
        return response.json();
    },

    getSensorDetailsByBuilding: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/buildings/details/${buildingId}`);
        return response.json();
    },

    updateSensor: async (updatedSensorData) => {
        const response = await fetch(`${API_BASE_URL}/sensors/${updatedSensorData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSensorData),
        });

        if (!response.ok) {
            throw new Error("Failed to update sensor");
        }

        return await response.json();
    },

    updateSensorStatus: async (updatedSensorStatus) => {
        const response = await fetch(`${API_BASE_URL}/sensors/active/${updatedSensorStatus.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSensorStatus)
        });

        if (!response.ok) {
            throw new Error("Failed to update sensor status");
        }
    },

    getAllSensorAlertCards: async () => {
        const response = await fetch(`${API_BASE_URL}/sensor_alerts/alert_cards`);
        return response.json();
    }
};