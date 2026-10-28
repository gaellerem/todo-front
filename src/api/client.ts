import axios from "axios";
import toast from "react-hot-toast";
import type { Category } from "../models/categories";
import type { Task } from "../models/tasks";

interface CreateTaskPayload {
  description: string;
  is_completed?: boolean;
  category_id: number;
}

interface AuthResponse {
    token: string;
}

const AUTH_TOKEN_KEY = "todo-auth-token";

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string | null) => {
    if (token) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
};

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    const route = config.url?.replace(/^\/+/, "") ?? "";
    const isPublicAuthRoute = /^auth\/(login|register)\/?$/.test(route);

    if (token && !isPublicAuthRoute) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        const method = error.config?.method?.toUpperCase() ?? "REQUEST";
        const target = error.config?.baseURL && error.config?.url
            ? `${error.config.baseURL.replace(/\/+$/, "")}/${error.config.url.replace(/^\/+/, "")}`
            : error.config?.url ?? "API";

        if (!error.response) {
            const message = `Impossible de joindre le serveur (${method} ${target}). Vérifiez que le backend est démarré.`;
            toast.error(message);
            return Promise.reject(Object.assign(new Error(message), { type: "network" }));
        }

        const { status, data } = error.response;
        const detail = typeof data?.detail === "string" ? data.detail : undefined;

        if (status >= 500) {
            const message = detail ?? `Erreur serveur (${status}) : ${method} ${target}`;
            toast.error(message);
            return Promise.reject(Object.assign(new Error(message), { type: "server", status }));
        }

        if (status === 400) {
            return Promise.reject(Object.assign(new Error(detail ?? "Données invalides."), {
                type: "validation",
                status,
                errors: data,
            }));
        }

        if (status === 404) {
            const message = detail ?? `Route introuvable (${status}) : ${method} ${target}`;
            toast.error(message);
            return Promise.reject(Object.assign(new Error(message), { type: "not_found", status }));
        }

        // Autres erreurs
        const message = detail ?? `Erreur ${status} : ${method} ${target}`;
        toast.error(message);
        return Promise.reject(Object.assign(new Error(message), { type: "other", status }));
    }
);

const handleRequest = async <T>(promise: Promise<any>): Promise<T> => {
    const response = await promise;
    return response.data;
};

export const getCategories = () => handleRequest<Category[]>(api.get("categories/"));

export const register = (username: string, password: string) =>
    handleRequest<AuthResponse>(api.post("auth/register/", { username, password }));

export const login = (username: string, password: string) =>
    handleRequest<AuthResponse>(api.post("auth/login/", { username, password }));

export const logout = () => handleRequest<void>(api.post("auth/logout/"));

export const createCategory = (name: string) => handleRequest<Category>(api.post("categories/", { name }));

export const getTasks = (params?: { category_id?: number }) => handleRequest<Task[]>(api.get("tasks/", { params }));

export const getTask = (id: number) => handleRequest<Task>(api.get(`tasks/${id}/`));

export const createTask = (payload: CreateTaskPayload) => handleRequest<Task>(api.post("tasks/", payload));

export const updateTask = (id: number, payload: Partial<CreateTaskPayload>) => handleRequest<Task>(api.patch(`tasks/${id}/`, payload));

export const deleteTask = (id: number) => handleRequest<void>(api.delete(`tasks/${id}/`));