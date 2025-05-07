import { COOKIE_TOKEN } from '.././utils/const';
import { useNavigate } from 'react-router-dom';
import { apiPostReq } from '../api/api';
import { useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState(false);
    const isAuthChecked = useRef(null);
    const navigate = useNavigate();

    const checkAuth = async (forceCheck?: boolean) => {
        if (!isAuthChecked.current || forceCheck) {
            const token = Cookies.get(COOKIE_TOKEN);

            if (token) {
                setIsAuth(true);
                if (
                    window.location.pathname === '/login' ||
                    window.location.pathname === '/registration'
                ) {
                    navigate('/');
                }
                navigate(window.location.pathname);
                return;
            }
            await logout();
        } else {
            console.log('Already checked');
        }
    };

    const login = async (values: { user_name: string; password: string }) => {
        const data = await apiPostReq('auth', values);

        if (data.cookieToken) {
            Cookies.set(COOKIE_TOKEN, data.cookieToken, { expires: 9999 });
            await checkAuth(true);
        }
    };

    const registration = async (values: { user_name: string; password: string }) => {
        const data = await apiPostReq('registration', values);

        if (data.cookieToken) {
            Cookies.set(COOKIE_TOKEN, data.cookieToken, { expires: 9999 });
            await checkAuth(true);
        }
    };

    const logout = async () => {
        setIsAuth(false);
        navigate('/login');
        const token = Cookies.get(COOKIE_TOKEN);
        if (token) {
            await apiPostReq('logout', { token });
        }

        Cookies.remove(COOKIE_TOKEN);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                isAuthChecked,
                checkAuth,
                login,
                logout,
                registration,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
