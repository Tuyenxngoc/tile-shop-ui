import { axiosPrivate } from '~/utils/httpRequest';

export const getProductById = (id) => {
    return axiosPrivate.get(`admin/products/${id}`);
};

export const getProducts = (params) => {
    return axiosPrivate.get(`admin/products?${params}`);
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

    return axiosPrivate.put(`admin/products/${id}`, formData, {
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

    return axiosPrivate.post('admin/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteProduct = (id) => {
    return axiosPrivate.delete(`admin/products/${id}`);
};

export const getProductBySlug = (slug) => {
    return axiosPrivate.get(`products/slug/${slug}`);
};
