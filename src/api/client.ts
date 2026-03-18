import axios from "axios";
import toast from "react-hot-toast";
import type { Category } from "../models/categories";
import type { Task } from "../models/tasks";

interface CreateTaskPayload {
  description: string;
  is_completed?: boolean;
  category_id: number;
}

export const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            return Promise.reject({ type: "network", message: "Impossible de joindre le serveur." });
        }

        const { status, data } = error.response;

        if (status >= 500) {
            toast.error("Erreur serveur, réessayez plus tard.");
            return Promise.reject({ type: "server", message: "Erreur serveur." });
        }

        if (status === 400) {
            return Promise.reject({ type: "validation", errors: data });
        }

        if (status === 404) {
            toast.error("Ressource non trouvée.");
            return Promise.reject({ type: "not_found", message: "Ressource non trouvée." });
        }

        // Autres erreurs
        toast.error(data?.detail || "Une erreur est survenue.");
        return Promise.reject({ type: "other", message: data?.detail || "Erreur inconnue." });
    }
);

const handleRequest = async <T>(promise: Promise<any>): Promise<T> => {
    const response = await promise;
    return response.data;
};

export const getCategories = () => handleRequest<Category[]>(api.get("categories/"));

export const createCategory = (name: string) => handleRequest<Category>(api.post("categories/", { name }));

export const getTasks = () => handleRequest<Task[]>(api.get("tasks/"));

export const getTask = (id: number) => handleRequest<Task>(api.get(`tasks/${id}/`));

export const createTask = (payload: CreateTaskPayload) => handleRequest<Task>(api.post("tasks/", payload));

export const updateTask = (id: number, payload: Partial<CreateTaskPayload>) => handleRequest<Task>(api.patch(`tasks/${id}/`, payload));

export const deleteTask = (id: number) => handleRequest<void>(api.delete(`tasks/${id}/`));