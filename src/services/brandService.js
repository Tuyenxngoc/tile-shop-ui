import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

export const getBrandById = (id) => {
    return httpRequest.get(`brands/${id}`);
};

export const getBrands = (params) => {
    return httpRequest.get('brands', { params });
};

export const updateBrand = (id, values, image) => {
    const formData = new FormData();
    formData.append('brand', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.put(`brands/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createBrand = (values, image) => {
    const formData = new FormData();
    formData.append('brand', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.post('brands', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteBrand = (id) => {
    return axiosPrivate.delete(`brands/${id}`);
};
