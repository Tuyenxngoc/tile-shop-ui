import { axiosPrivate } from '~/utils/httpRequest';

export const createVnpayPaymentUrl = (params) => {
    return axiosPrivate.get('payment/vn-pay', { params });
};

export const handleVnpayReturn = (params) => {
    return axiosPrivate.get('payment/vn-pay-return', { params });
};
