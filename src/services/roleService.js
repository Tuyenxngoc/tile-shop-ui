import { axiosPrivate } from '~/utils/httpRequest';

export const getRoles = () => {
    return axiosPrivate.get('roles');
};
