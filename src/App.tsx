import { useState } from 'react';
import { getAuthToken, logout, setAuthToken } from './api/client';
import AuthScreen from './components/AuthScreen';
import ToDo from './components/ToDo'
import { Toaster } from 'react-hot-toast';

function App() {
    const [token, setToken] = useState(() => getAuthToken());
    const [username, setUsername] = useState(() => window.localStorage.getItem('todo-username') ?? '');

    const handleAuthenticated = (authToken: string, authUsername: string) => {
        setAuthToken(authToken);
        window.localStorage.setItem('todo-username', authUsername);
        setUsername(authUsername);
        setToken(authToken);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // Efface aussi la session locale si le serveur est indisponible.
        } finally {
            setAuthToken(null);
            window.localStorage.removeItem('todo-username');
            setUsername('');
            setToken(null);
        }
    };

    return (
        <>
        <Toaster position="top-center" reverseOrder={false} />
        {token ? (
            <>
                <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                    <p className="text-sm text-gray-700">Connecté en tant que <strong>{username}</strong></p>
                    <button className="w-auto!" onClick={handleLogout} type="button">Se déconnecter</button>
                </header>
                <ToDo />
            </>
        ) : (
            <AuthScreen onAuthenticated={handleAuthenticated} />
        )}
        </>
    );
}

export default App
