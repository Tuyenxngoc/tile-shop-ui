import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

// ---------- ADMIN ----------

export const updateOrderStatus = (id, status) => {
    return axiosPrivate.put(`admin/orders/${id}/status`, { status });
};

export const getOrders = (params) => {
    return axiosPrivate.get(`admin/orders?${params}`);
};

export const getOrderById = (id) => {
    return axiosPrivate.get(`admin/orders/${id}`);
};

// ---------- USER ----------

export const getAllOrdersForUser = (params) => {
    return httpRequest.get(`orders/orders?${params}`);
};

export const createOrder = (orderData) => {
    return httpRequest.post('orders/orders', orderData);
};

export const getOrderByIdForUser = (id) => {
    return httpRequest.get(`orders/orders/${id}`);
};
