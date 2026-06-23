import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.1.6:3001";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Auth token u memoriji
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Interceptor — ubaci JWT token u sve zahtjeve
apiClient.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

// Interceptor za response — uhvati 401 i obriši token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@auth_user');
            setAuthToken(null);
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    register: async (name: string, email: string, password: string) => {
        const response = await apiClient.post("/auth/register", { name, email, password });
        return response.data; // { token, user: { id, name, email } }
    },

    login: async (email: string, password: string) => {
        const response = await apiClient.post("/auth/login", { email, password });
        return response.data; // { token, user: { id, name, email } }
    },
};

export const foodApi = {
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

    getGoal: async (): Promise<number> => {
        const response = await apiClient.get("/logs/goal");
        return response.data.calorieGoal;
    },

    updateGoal: async (calorieGoal: number) => {
        const response = await apiClient.put("/logs/goal", { calorieGoal });
        return response.data;
    },
};
