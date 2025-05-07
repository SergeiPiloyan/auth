import { AuthProvider } from './auth/AuthProvider.tsx';
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
