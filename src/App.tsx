import ToDo from './components/ToDo'
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <>
        <Toaster position="top-center" reverseOrder={false} />
        <ToDo />
        </>
    );
}

export default App
