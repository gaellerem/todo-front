import { useState, type FormEvent } from "react";
import { login, register } from "../api/client";
import "./AuthScreen.css";

interface AuthScreenProps {
    onAuthenticated: (token: string, username: string) => void;
}

function AuthScreen({ onAuthenticated }: AuthScreenProps) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = mode === "login"
                ? await login(username.trim(), password)
                : await register(username.trim(), password);
            if (!response.token) {
                throw new Error("La réponse du serveur ne contient pas de token.");
            }
            onAuthenticated(response.token, username.trim());
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : "Authentification impossible. Vérifiez vos identifiants.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const isLogin = mode === "login";

    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
            <header className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Todo par catégories</p>
                <h1 className="text-3xl font-bold text-gray-900">{isLogin ? "Bon retour" : "Créer un compte"}</h1>
                <p className="mt-2 text-gray-600">
                    {isLogin ? "Connectez-vous pour retrouver vos tâches." : "Créez un compte pour organiser vos tâches."}
                </p>
            </header>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Nom d’utilisateur
                    <input
                        autoComplete="username"
                        className="rounded border border-gray-300 px-3 py-2"
                        name="username"
                        required
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Mot de passe
                    <input
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        className="rounded border border-gray-300 px-3 py-2"
                        name="password"
                        required
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </label>
                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
                <button className="auth-submit" disabled={submitting || !username.trim() || !password} type="submit">
                    {submitting ? "Connexion..." : isLogin ? "Se connecter" : "Créer mon compte"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}{" "}
                <button
                    className="auth-mode-toggle"
                    onClick={() => {
                        setMode(isLogin ? "register" : "login");
                        setError("");
                    }}
                    type="button"
                >
                    {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
            </p>
        </main>
    );
}

export default AuthScreen;