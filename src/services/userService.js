import { axiosPrivate } from '~/utils/httpRequest';

export const getUserById = (id) => {
    return axiosPrivate.get(`users/${id}`);
};

export const getUsers = (params) => {
    return axiosPrivate.get(`users?${params}`);
};

export const updateUser = (id, values) => {
    return axiosPrivate.put(`users/${id}`, values);
};

export const updateMyProfile = (values) => {
    return axiosPrivate.put('users/me', values);
};

export const createUser = (values) => {
    return axiosPrivate.post('users', values);
};

export const deleteUser = (id) => {
    return axiosPrivate.delete(`users/${id}`);
};

export const toggleUserActive = (id) => {
    return axiosPrivate.patch(`users/${id}/toggle-active`);
};
