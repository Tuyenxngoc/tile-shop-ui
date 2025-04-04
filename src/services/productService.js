import { axiosPrivate } from '~/utils/httpRequest';

export const getProductById = (id) => {
    return axiosPrivate.get(`products/${id}`);
};

export const getProducts = (params) => {
    return axiosPrivate.get(`products?${params}`);
};

export const updateProduct = (id, values, images) => {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(values)], { type: 'application/json' }));
    if (images && images.length > 0) {
        images.forEach((image) => {
            formData.append('images', image.originFileObj);
        });
    }

    return axiosPrivate.put(`products/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createProduct = (values, images) => {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(values)], { type: 'application/json' }));
    if (images && images.length > 0) {
        images.forEach((image) => {
            formData.append('images', image.originFileObj);
        });
    }

    return axiosPrivate.post('products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteProduct = (id) => {
    return axiosPrivate.delete(`products/${id}`);
};

export const getProductBySlug = (slug) => {
    return axiosPrivate.get(`products/slug/${slug}`);
};
