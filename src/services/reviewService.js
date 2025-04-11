import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

// ---------- ADMIN ----------
export const approveReview = (id) => {
    return axiosPrivate.put(`reviews/${id}/approve`);
};

export const rejectReview = (id) => {
    return axiosPrivate.put(`reviews/${id}/reject`);
};

export const getPendingReviews = (params) => {
    return axiosPrivate.get(`reviews/pending?${params}`);
};

export const deleteReview = (id) => {
    return axiosPrivate.delete(`reviews/${id}`);
};

// ---------- USER ----------
export const createReview = (values, images) => {
    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify(values)], { type: 'application/json' }));
    if (images && images.length > 0) {
        images.forEach((image) => {
            formData.append('images', image.originFileObj);
        });
    }

    return axiosPrivate.post(`reviews`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getReviewSummaryByProductId = (productId) => {
    return httpRequest.get(`reviews/summary/${productId}`);
};

export const getReviewsByProductId = (productId, params) => {
    return httpRequest.get(`reviews/product/${productId}?${params}`);
};
