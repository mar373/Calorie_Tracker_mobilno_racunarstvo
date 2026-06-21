import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "YOUR_API_BASE_URL"; // Placeholder
const USERS_STORAGE_KEY = "@mock_users";

// Helper to check if API URL is configured
const isApiConfigured = API_BASE_URL && API_BASE_URL !== "YOUR_API_BASE_URL";

const apiClient = axios.create({
    baseURL: isApiConfigured ? API_BASE_URL : "",
    headers: {
        "Content-Type": "application/json",
    },
});

// Auth token state
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Add interceptor to inject JWT token in requests
apiClient.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

// Simple base64 encoder helper for mock JWT creation
const base64Encode = (str: string) => {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';
        for (let block = 0, charCode, i = 0, map = chars;
             str.charAt(i | 0) || (map = '=', i % 1);
             output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
            charCode = str.charCodeAt(i += 3 / 4);
            block = block << 8 | charCode;
        }
        return output;
    }
};

// Mock JWT Token Generator
const generateMockJWT = (payload: object) => {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = base64Encode(JSON.stringify(header));
    const encodedPayload = base64Encode(JSON.stringify(payload));
    const signature = base64Encode("antigravity-mock-secret-key");
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const authApi = {
    register: async (name: string, email: string, password: string) => {
        if (isApiConfigured) {
            const response = await apiClient.post("/auth/register", { name, email, password });
            return response.data; // Expected { token, user: { id, name, email } }
        }

        // Fallback Client-side Simulation
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
        const storedUsersStr = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        const users = storedUsersStr ? JSON.parse(storedUsersStr) : [];

        // Check if user already exists
        const userExists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            throw new Error("Korisnik sa ovim e-mailom već postoji.");
        }

        const newUser = {
            id: `usr_${Date.now()}`,
            name,
            email: email.toLowerCase(),
            password // In production this would be hashed on the server
        };

        users.push(newUser);
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        const userPayload = { id: newUser.id, name: newUser.name, email: newUser.email };
        const token = generateMockJWT(userPayload);

        return {
            token,
            user: userPayload
        };
    },

    login: async (email: string, password: string) => {
        if (isApiConfigured) {
            const response = await apiClient.post("/auth/login", { email, password });
            return response.data; // Expected { token, user: { id, name, email } }
        }

        // Fallback Client-side Simulation
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
        const storedUsersStr = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        const users = storedUsersStr ? JSON.parse(storedUsersStr) : [];

        const user = users.find(
            (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
            throw new Error("Neispravan e-mail ili lozinka.");
        }

        const userPayload = { id: user.id, name: user.name, email: user.email };
        const token = generateMockJWT(userPayload);

        return {
            token,
            user: userPayload
        };
    }
};

export const foodApi = {
    // CRUD operations
    getLogs: async () => {
        if (isApiConfigured) {
            const response = await apiClient.get("/logs");
            return response.data;
        }
        // If not configured, App fallback to AsyncStorage/Firebase in useStorage.ts is active
        return [];
    },
    createLog: async (log: any) => {
        if (isApiConfigured) {
            const response = await apiClient.post("/logs", log);
            return response.data;
        }
        return log;
    },
    updateLog: async (id: string, log: any) => {
        if (isApiConfigured) {
            const response = await apiClient.put(`/logs/${id}`, log);
            return response.data;
        }
        return log;
    },
    deleteLog: async (id: string) => {
        if (isApiConfigured) {
            const response = await apiClient.delete(`/logs/${id}`);
            return response.data;
        }
        return { success: true };
    },
};
