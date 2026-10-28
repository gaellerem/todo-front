import { afterEach, describe, expect, it } from "vitest";
import { api, createTask, login, setAuthToken } from "./client";

afterEach(() => {
    setAuthToken(null);
});

describe("client API authentifié", () => {
    it("envoie un POST login vers la route configurée avec les identifiants saisis", async () => {
        const originalAdapter = api.defaults.adapter;
        let requestMethod = "";
        let requestUrl = "";
        let requestPayload: Record<string, unknown> | undefined;
        let requestAuthorization: unknown;
        api.defaults.adapter = async (config) => {
            requestMethod = config.method ?? "";
            requestUrl = `${config.baseURL?.replace(/\/+$/, "")}/${config.url?.replace(/^\/+/, "")}`;
            requestPayload = JSON.parse(config.data as string) as Record<string, unknown>;
            requestAuthorization = config.headers.get("Authorization");
            return {
                data: { token: "session-token" },
                status: 200,
                statusText: "OK",
                headers: {},
                config,
            };
        };
        setAuthToken("stale-token");

        try {
            await login("camille", "password");
        } finally {
            api.defaults.adapter = originalAdapter;
        }

        expect(requestMethod).toBe("post");
        expect(requestUrl).toBe(`${import.meta.env.VITE_API_URL}/api/auth/login/`);
        expect(requestPayload).toEqual({ username: "camille", password: "password" });
        expect(requestAuthorization).toBeUndefined();
    });

    it("envoie le token Token et ne joint pas user_id à une création de tâche", async () => {
        const originalAdapter = api.defaults.adapter;
        let requestHeaders: Record<string, unknown> | undefined;
        let requestPayload: Record<string, unknown> | undefined;
        api.defaults.adapter = async (config) => {
            requestHeaders = config.headers.toJSON();
            requestPayload = JSON.parse(config.data as string) as Record<string, unknown>;
            return {
                data: { id: 8, description: "Lire", is_completed: false, category: { id: 3, name: "Perso" } },
                status: 201,
                statusText: "Created",
                headers: {},
                config,
            };
        };
        setAuthToken("test-token");

        try {
            await createTask({ description: "Lire", category_id: 3 });
        } finally {
            api.defaults.adapter = originalAdapter;
        }

        expect(requestHeaders?.Authorization).toBe("Token test-token");
        expect(requestPayload).toEqual({ description: "Lire", category_id: 3 });
        expect(requestPayload).not.toHaveProperty("user_id");
    });
});