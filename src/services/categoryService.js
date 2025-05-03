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

export const updateCategory = (id, values) => {
    return axiosPrivate.put(`categories/${id}`, values);
};

export const createCategory = (values) => {
    return axiosPrivate.post('categories', values);
};

export const deleteCategory = (id) => {
    return axiosPrivate.delete(`categories/${id}`);
};
