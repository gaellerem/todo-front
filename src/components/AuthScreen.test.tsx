import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { login, register } from "../api/client";
import AuthScreen from "./AuthScreen";

vi.mock("../api/client", () => ({
    login: vi.fn(),
    register: vi.fn(),
}));

afterEach(cleanup);

describe("AuthScreen", () => {
    it("se connecte avec le nom d’utilisateur et le mot de passe puis transmet le token", async () => {
        const user = userEvent.setup();
        const onAuthenticated = vi.fn();
        vi.mocked(login).mockResolvedValue({ token: "session-token" });
        render(<AuthScreen onAuthenticated={onAuthenticated} />);

        await user.type(screen.getByLabelText("Nom d’utilisateur"), "camille");
        await user.type(screen.getByLabelText("Mot de passe"), "secret");
        await user.click(screen.getByRole("button", { name: "Se connecter" }));

        expect(login).toHaveBeenCalledWith("camille", "secret");
        expect(onAuthenticated).toHaveBeenCalledWith("session-token", "camille");
    });

    it("permet de créer un compte avec les mêmes identifiants", async () => {
        const user = userEvent.setup();
        const onAuthenticated = vi.fn();
        vi.mocked(register).mockResolvedValue({ token: "new-session-token" });
        render(<AuthScreen onAuthenticated={onAuthenticated} />);

        await user.click(screen.getByRole("button", { name: "Créer un compte" }));
        await user.type(screen.getByLabelText("Nom d’utilisateur"), "camille");
        await user.type(screen.getByLabelText("Mot de passe"), "secret");
        await user.click(screen.getByRole("button", { name: "Créer mon compte" }));

        expect(register).toHaveBeenCalledWith("camille", "secret");
        expect(onAuthenticated).toHaveBeenCalledWith("new-session-token", "camille");
    });
});