import { axiosPrivate } from '~/utils/httpRequest';

export const getSlideById = (id) => {
    return axiosPrivate.get(`slides/${id}`);
};

export const getSlides = () => {
    return axiosPrivate.get('slides');
};

export const updateSlide = (id, values, image) => {
    const formData = new FormData();
    formData.append('slide', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.put(`slides/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createSlide = (values, image) => {
    const formData = new FormData();
    formData.append('slide', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (image?.originFileObj) {
        formData.append('image', image.originFileObj);
    }

    return axiosPrivate.post('slides', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteSlide = (id) => {
    return axiosPrivate.delete(`slides/${id}`);
};
