import httpRequest, { axiosPrivate } from '~/utils/httpRequest.js';

export const loginAPI = (values) => {
    return httpRequest.post('auth/login', values);
};

export const forgetPassword = (values) => {
    return httpRequest.post('auth/forget-password', values);
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
