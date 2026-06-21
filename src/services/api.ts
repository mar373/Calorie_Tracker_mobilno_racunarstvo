import axios from "axios";

const API_BASE_URL = "YOUR_API_BASE_URL"; // Placeholder

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const foodApi = {
    // CRUD operations
    getLogs: async () => {
        const response = await apiClient.get("/logs");
        return response.data;
    },
    createLog: async (log: any) => {
        const response = await apiClient.post("/logs", log);
        return response.data;
    },
    updateLog: async (id: string, log: any) => {
        const response = await apiClient.put(`/logs/${id}`, log);
        return response.data;
    },
    deleteLog: async (id: string) => {
        const response = await apiClient.delete(`/logs/${id}`);
        return response.data;
    },
};
