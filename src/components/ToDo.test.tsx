import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCategories, getTasks } from "../api/client";
import ToDo from "./ToDo";

vi.mock("../api/client", () => ({
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    getTasks: vi.fn(),
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    updateTask: vi.fn(),
}));

afterEach(cleanup);

const category = { id: 1, name: "Travail" };
const tasks = [
    { id: 1, description: "Rédiger le rapport", is_completed: false, created_at: "2026-10-27T10:00:00Z", category },
    { id: 2, description: "Envoyer le rapport", is_completed: true, created_at: "2026-10-27T11:00:00Z", category },
];

describe("ToDo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getCategories).mockResolvedValue([category]);
    });

    it("affiche le chargement tant que la requête des tâches est en attente", async () => {
        let resolveTasks!: (result: typeof tasks) => void;
        vi.mocked(getTasks).mockReturnValue(new Promise((resolve) => {
            resolveTasks = resolve;
        }));

        render(<ToDo />);

        expect(screen.getByRole("status")).toHaveTextContent("Chargement...");
        resolveTasks(tasks);
        expect(await screen.findByText("Rédiger le rapport (Travail)")).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
    });

    it("affiche toutes les tâches lorsque la requête réussit", async () => {
        vi.mocked(getTasks).mockResolvedValue(tasks);

        render(<ToDo />);

        expect(await screen.findByText("Rédiger le rapport (Travail)")).toBeInTheDocument();
        expect(screen.getByText("Envoyer le rapport (Travail)")).toBeInTheDocument();
    });

    it("affiche une alerte rouge lorsque la requête échoue", async () => {
        vi.mocked(getTasks).mockRejectedValue(new Error("Erreur serveur"));
        vi.spyOn(console, "log").mockImplementation(() => undefined);

        render(<ToDo />);

        const alert = await screen.findByRole("alert");
        expect(alert).toHaveTextContent("Impossible de charger les tâches.");
        expect(alert).toHaveClass("text-red-600");
    });
});