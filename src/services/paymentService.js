import { axiosPrivate } from '~/utils/httpRequest';

// VNPay
export const createVnpayPaymentUrl = (params) => {
    return axiosPrivate.get('payment/vn-pay', { params });
};

export const handleVnpayReturn = (params) => {
    return axiosPrivate.get('payment/vn-pay-return', { params });
};

// ZaloPay
export const createZalopayPayment = (params) => {
    return axiosPrivate.get('payment/zalopay', { params });
};

export const handleZalopayReturn = (data) => {
    return axiosPrivate.post('payment/zalopay-return', data);
};

// PayOS
export const createPayosPayment = (params) => {
    return axiosPrivate.get('payment/payos/create-payment', { params });
};
