import { useEffect, useState } from 'react';
import { Auth } from '.././pages/Auth';
import { Route, Routes } from 'react-router-dom';
import { Home } from '.././pages/Home';
import { useAuth } from '.././auth/useAuth';

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
    }, []);

    if (loading) {
        return <div>LOADING...</div>;
    }

    return (
        <Routes>
            <Route path='/login' element={<Auth isLogin={true} />} />
            <Route path='/registration' element={<Auth isLogin={false} />} />
            <Route path='/' element={<Home />} />
        </Routes>
    );
};
