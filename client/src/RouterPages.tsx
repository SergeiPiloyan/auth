import { useEffect, useState } from 'react';
import { useAuth } from './auth';
import { Login } from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';

export const RouterPages = () => {
    const { checkAuth, isAuthChecked } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            if (isAuthChecked.current === null) {
                await checkAuth();
                setLoading(false);
            }
        };

        check();
    }, [checkAuth, isAuthChecked]);

    if (loading) {
        return <div>LOADING...</div>;
    }

    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
        </Routes>
    );
};
