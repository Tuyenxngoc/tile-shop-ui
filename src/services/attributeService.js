import { axiosPrivate } from '~/utils/httpRequest';

export const getAttributeById = (id) => {
    return axiosPrivate.get(`attributes/${id}`);
};

export const getAttributeByCategoryId = (id) => {
    return axiosPrivate.get(`attributes/category/${id}`);
};

export const getAttributes = (params) => {
    return axiosPrivate.get(`attributes?${params}`);
};

export const updateAttribute = (id, values) => {
    return axiosPrivate.put(`attributes/${id}`, values);
};

export const createAttribute = (values) => {
    return axiosPrivate.post('attributes', values);
};

export const deleteAttribute = (id) => {
    return axiosPrivate.delete(`attributes/${id}`);
};
