import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { COOKIE_TOKEN, TECH_ERROR } from '../utils/const';

export const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL });

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data.errorCode !== 0) {
            toast.error(response.data.message || TECH_ERROR);
        }

        return response;
    },
    (error) => toast.error(error.response?.data?.message || TECH_ERROR)
);

axiosInstance.interceptors.request.use((req) => {
    const token = Cookies.get(COOKIE_TOKEN);
    req.headers.set('Authorization', token);

    return req;
});
