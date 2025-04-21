import { axiosPrivate } from '~/utils/httpRequest';

export const initiateVnpayPayment = (params) => {
    return axiosPrivate.get(`payment/vn-pay?${params}`);
};
