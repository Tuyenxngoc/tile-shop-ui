import { axiosPrivate } from '~/utils/httpRequest';

export const getNewsCategoryById = (id) => {
    return axiosPrivate.get(`news-categories/${id}`);
};

export const getNewsCategories = (params) => {
    return axiosPrivate.get(`news-categories?${params}`);
};

export const updateNewsCategory = (id, values) => {
    return axiosPrivate.put(`news-categories/${id}`, values);
};

export const createNewsCategory = (values) => {
    return axiosPrivate.post('news-categories', values);
};

export const deleteNewsCategory = (id) => {
    return axiosPrivate.delete(`news-categories/${id}`);
};
