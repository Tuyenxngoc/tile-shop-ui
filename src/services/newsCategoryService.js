import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

export const getNewsCategoryById = (id) => {
    return httpRequest.get(`news-categories/${id}`);
};

export const getNewsCategories = (params) => {
    return httpRequest.get('news-categories', { params });
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
