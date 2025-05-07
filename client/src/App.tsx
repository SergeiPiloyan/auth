import { AuthProvider } from './auth/AuthProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import { RouterPages } from './router/RouterPages.tsx';

export const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RouterPages />
            </AuthProvider>
        </BrowserRouter>
    );
};
