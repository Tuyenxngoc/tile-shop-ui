import { axiosPrivate } from '~/utils/httpRequest';

export const getCategoryById = (id) => {
    return axiosPrivate.get(`categories/${id}`);
};

export const getCategories = (params) => {
    return axiosPrivate.get(`categories?${params}`);
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

export const getCategoriesTree = () => {
    return axiosPrivate.get('categories/tree');
};
