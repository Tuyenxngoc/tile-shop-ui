import httpRequest, { axiosPrivate } from '~/utils/httpRequest.js';

export const loginAPI = (values) => {
    return httpRequest.post('auth/login', values);
};

export const forgotPassword = (values) => {
    return httpRequest.post('auth/forgot-password', values);
};

export const registerAPI = (values) => {
    return httpRequest.post('auth/register', values);
};

export const changePassword = (values) => {
    return axiosPrivate.patch('auth/change-password', values);
};

export const refreshTokenAPI = (values) => {
    return httpRequest.post('auth/refresh-token', values);
};

export const logoutToken = (refreshToken) => {
    return axiosPrivate.post(
        'auth/logout',
        {},
        {
            headers: {
                'X-Refresh-Token': refreshToken,
            },
        },
    );
};

export const getCurrentUserLogin = () => {
    return axiosPrivate.get('auth/current');
};
