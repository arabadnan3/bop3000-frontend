const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`;

export const api = {
    // DASHBOARD PAGE

    // Retrieves a list of all the buildings
    getBuildings: async () => {
        const response = await fetch(`${API_BASE_URL}/buildings`);
        return response.json();
    },

    // Retrieves a list of rooms from a selected building,
    getRoomsFromBuilding: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/building/${buildingId}`);
        return response.json();
    },

    // Retrieves the room details from a selected room.
    getRoomDetails: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/details/${roomId}`);
        return response.json();
    },

    // Retrieves the sensor details from a selected room.
    getSensorsFromRoom: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/rooms/${roomId}`);
        return response.json();
    },

    // Retrieves the latest reading from a sensor
    getLatestReading: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings/latest/${sensorId}`);
        return response.json();
    },

    // Retrieve sensor log data from a chosen sensor
    getSensorReadingsFrom24Hours: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings/aggregated/${sensorId}`);
        return response.json();
    },

    // SENSORS PAGE

    // Retrieves a list of building cards.
    getBuildingCards: async () => {
        const response = await fetch(`${API_BASE_URL}/buildings/building_cards`);
        return response.json();
    },

    // Retrieves a list of room cards from a selected building.
    getRoomCards: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/rooms/room_cards/${buildingId}`);
        return response.json();
    },

    // Retrieves sensor details from a chosen sensor.
    getSensorDetails: async (sensorId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/details/${sensorId}`);
        return response.json();
    },

    // Settings

    // Warnings

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