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

    getRooms: async () => {
        const response = await fetch(`${API_BASE_URL}/rooms`);
        return response.json();
    },

    getTenants: async () => {
        const response = await fetch(`${API_BASE_URL}/tenants`);
        return response.json();
    },

    getLeases: async () => {
        const response = await fetch(`${API_BASE_URL}/leases`);
        return response.json();
    },

    getLeaseRooms: async () => {
        const response = await fetch(`${API_BASE_URL}/lease-rooms`);
        return response.json();
    },

    getSensors: async () => {
        const response = await fetch(`${API_BASE_URL}/sensors`);
        return response.json();
    },

    getSensorsFromRoom: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/rooms/${roomId}`);
        return response.json();
    },

    getSensorsFromBuilding: async (buildingId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/buildings/${buildingId}`);
        return response.json();
    },

    getSensorDetails: async (roomId) => {
        const response = await fetch(`${API_BASE_URL}/sensors/${roomId}`);
        return response.json();
    },

    getSensorReadings: async () => {
        const response = await fetch(`${API_BASE_URL}/sensor_readings`);
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

    getSensorRules: async () => {
        const response = await fetch(`${API_BASE_URL}/sensor_rules`);
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
        const response = await fetch(`${API_BASE_URL}/sensors/${updatedSensorStatus.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSensorStatus)
        });

        if (!response.ok) {
            throw new Error("Failed to update sensor status");
        }
    }
};