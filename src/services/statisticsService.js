import { axiosPrivate } from '~/utils/httpRequest';

export const getDashboardStatistics = (params) => {
    return axiosPrivate.get('statistics/dashboard', { params });
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

export const getRevenueByCategory = (params) => {
    return axiosPrivate.get('statistics/revenue-by-category', { params });
};
