const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    getBuildings: async () => {
        const response = await fetch(`${API_BASE_URL}/buildings`);
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
    }
};