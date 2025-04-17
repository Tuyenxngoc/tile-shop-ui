import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

// ---------- ADMIN ----------
export const getBrandById = (id) => {
    return axiosPrivate.get(`admin/brands/${id}`);
};

export const getBrands = (params) => {
    return axiosPrivate.get(`admin/brands?${params}`);
};

export const updateBrand = (id, values, image) => {
    const formData = new FormData();
    formData.append('brand', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.put(`admin/brands/${id}`, formData, {
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

    return axiosPrivate.post('admin/brands', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteBrand = (id) => {
    return axiosPrivate.delete(`admin/brands/${id}`);
};

// ---------- USER ----------
export const getBrandsForUser = (params) => {
    return httpRequest.get(`brands?${params}`);
};

export const getBrandByIdForUser = (id) => {
    return httpRequest.get(`brands/${id}`);
};
