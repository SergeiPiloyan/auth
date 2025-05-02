import { Login } from './pages/Login.tsx';
import { Home } from './pages/Home.tsx';
import { AuthProvider } from './auth.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/' element={<Home />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
