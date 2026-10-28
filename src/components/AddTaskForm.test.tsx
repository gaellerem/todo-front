import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AddTaskForm from "./AddTaskForm";

afterEach(cleanup);

const categories = [
    { id: 1, name: "Maison" },
    { id: 2, name: "Travail" },
];

describe("AddTaskForm", () => {
    it("contient un champ texte et un select, et désactive Ajouter si un champ requis manque", async () => {
        const user = userEvent.setup();
        render(<AddTaskForm categories={categories} loading={false} onSubmit={vi.fn()} />);

        const titleInput = screen.getByRole("textbox", { name: "Nouvelle tâche" });
        const categorySelect = screen.getByRole("combobox", { name: "Catégorie de la tâche" });
        const submitButton = screen.getByRole("button", { name: "Ajouter" });

        expect(titleInput).toBeInTheDocument();
        expect(categorySelect).toBeInTheDocument();
        expect(submitButton).toBeDisabled();

        await user.type(titleInput, "Appeler le médecin");
        expect(submitButton).toBeDisabled();

        await user.selectOptions(categorySelect, "2");
        expect(submitButton).toBeEnabled();
    });

    it("transmet le titre et la catégorie sélectionnée lors de la soumission", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<AddTaskForm categories={categories} loading={false} onSubmit={onSubmit} />);

        await user.type(screen.getByRole("textbox", { name: "Nouvelle tâche" }), "  Préparer la réunion  ");
        await user.selectOptions(screen.getByRole("combobox", { name: "Catégorie de la tâche" }), "1");
        await user.click(screen.getByRole("button", { name: "Ajouter" }));

        expect(onSubmit).toHaveBeenCalledWith("Préparer la réunion", 1);
    });
});