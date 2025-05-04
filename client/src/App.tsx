import { AuthProvider } from './auth.tsx';
import { BrowserRouter } from 'react-router-dom';
import { RouterPages } from './RouterPages.tsx';

export const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RouterPages />
            </AuthProvider>
        </BrowserRouter>
    );
};
