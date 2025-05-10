import { axiosPrivate } from '~/utils/httpRequest';

// ---------- ADMIN ----------

export const updateOrderStatus = (id, status) => {
    return axiosPrivate.put(`admin/orders/${id}/status?status=${status}`);
};

export const getOrders = (params) => {
    return axiosPrivate.get('admin/orders', { params });
};

export const getOrderCountByStatus = () => {
    return axiosPrivate.get(`admin/orders/count-by-status`);
};

export const exportOrderReport = (filter) => {
    return axiosPrivate.get('admin/orders/export-report', {
        params: filter,
        responseType: 'arraybuffer',
    });
};

// ---------- USER ----------

export const getAllOrdersForUser = (params) => {
    return axiosPrivate.get('orders', { params });
};

export const getOrderById = (id) => {
    return axiosPrivate.get(`orders/${id}`);
};

export const createOrder = (orderData) => {
    return axiosPrivate.post('orders', orderData);
};

export const cancelOrder = (id, cancelReason) => {
    return axiosPrivate.put(`orders/${id}/cancel`, { cancelReason });
};
