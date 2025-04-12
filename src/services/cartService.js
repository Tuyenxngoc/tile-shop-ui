import { axiosPrivate } from '~/utils/httpRequest';

export const addToCart = (values) => {
    return axiosPrivate.post('cart/add', values);
};

export const updateCartItem = (productId, quantity) => {
    return axiosPrivate.put(`cart/update/${productId}?quantity=${quantity}`);
};

export const getCartItems = () => {
    return axiosPrivate.get('cart');
};

export const removeCartItem = (productId) => {
    return axiosPrivate.delete(`cart/remove/${productId}`);
};

export const clearCart = () => {
    return axiosPrivate.delete('cart/clear');
};
