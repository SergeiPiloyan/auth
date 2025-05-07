import { axiosInstance } from './axios';

export const apiPostReq = async (resource: string, body = {}) => {
    const rs = await axiosInstance.post(resource, body);

    return rs.data?.data;
};
