import { createContext, RefObject } from 'react';

type TAuthContext = {
    isAuth: boolean;
    isAuthChecked: RefObject<boolean | null>;
    checkAuth: (forceCheck?: boolean) => Promise<void>;
    login: (data: { user_name: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    registration: (data: { user_name: string; password: string }) => Promise<void>;
};

export const AuthContext = createContext<TAuthContext>({} as TAuthContext);
