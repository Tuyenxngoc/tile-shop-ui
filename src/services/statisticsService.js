import { axiosPrivate } from '~/utils/httpRequest';

export const getDashboardStatistics = () => {
    return axiosPrivate.get('statistics/dashboard');
};
