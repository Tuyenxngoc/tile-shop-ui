import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

export const getCategoryById = (id) => {
    return httpRequest.get(`categories/${id}`);
};

export const getCategories = (params) => {
    return httpRequest.get('categories', { params });
};

export const getCategoriesTree = () => {
    return httpRequest.get('categories/tree');
};

export const updateCategory = (id, values, image) => {
    const formData = new FormData();
    formData.append('category', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.put(`categories/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createCategory = (values, image) => {
    const formData = new FormData();
    formData.append('category', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.post('categories', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteCategory = (id) => {
    return axiosPrivate.delete(`categories/${id}`);
};
