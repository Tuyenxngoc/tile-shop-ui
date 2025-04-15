import { axiosPrivate } from '~/utils/httpRequest';

export const getNewsById = (id) => {
    return axiosPrivate.get(`news/${id}`);
};

export const getNews = (params) => {
    return axiosPrivate.get(`news?${params}`);
};

export const updateNews = (id, values, image) => {
    const formData = new FormData();
    formData.append('news', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.put(`news/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createNews = (values, image) => {
    const formData = new FormData();
    formData.append('news', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.post('news', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteNews = (id) => {
    return axiosPrivate.delete(`news/${id}`);
};
