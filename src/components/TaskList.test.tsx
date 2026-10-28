// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TaskList from "./TaskList";

afterEach(cleanup);

const task = {
    id: 1,
    description: "Rédiger les tests",
    is_completed: true,
    created_at: "2026-10-27T10:00:00Z",
    category: { id: 2, name: "Développement" },
};

describe("TaskList", () => {
    it("affiche le titre et la catégorie d'une tâche", () => {
        render(<TaskList tasks={[task]} onToggle={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByText("Rédiger les tests (Développement)")).toBeInTheDocument();
    });

    it("reflète visuellement l'état terminé", () => {
        render(<TaskList tasks={[task]} onToggle={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByRole("checkbox")).toBeChecked();
        expect(screen.getByText("Rédiger les tests (Développement)")).toHaveClass("line-through", "text-gray-400");
    });
});