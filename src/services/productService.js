import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

export const getProductById = (id) => {
    return httpRequest.get(`products/${id}`);
};

export const getProducts = (params) => {
    return httpRequest.get('products', { params });
};

export const getProductBySlug = (slug) => {
    return httpRequest.get(`products/slug/${slug}`);
};

export const searchProducts = (keyword, params) => {
    return httpRequest.get(`products/search`, {
        params: {
            keyword,
            ...params,
        },
    });
};

export const updateProduct = (id, values, images) => {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(values)], { type: 'application/json' }));
    if (images && images.length > 0) {
        images.forEach((image) => {
            if (image.originFileObj) {
                formData.append('images', image.originFileObj);
            }
        });
    }
    const existingImageUrls = images.filter((img) => !img.originFileObj && img.url).map((img) => img.url);
    formData.append('existingImages', new Blob([JSON.stringify(existingImageUrls)], { type: 'application/json' }));

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
