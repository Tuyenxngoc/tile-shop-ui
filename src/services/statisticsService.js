import { axiosPrivate } from '~/utils/httpRequest';

export const getDashboardStatistics = () => {
    return axiosPrivate.get('statistics/dashboard');
};

export const getTopSellingProducts = () => {
    return axiosPrivate.get('statistics/top-products');
};

export const getTopCustomers = () => {
    return axiosPrivate.get('statistics/top-customers');
};

export const getRecentOrders = () => {
    return axiosPrivate.get('statistics/recent-orders');
};

export const getRevenueStats = (params) => {
    return axiosPrivate.get('statistics/revenue', { params });
};
