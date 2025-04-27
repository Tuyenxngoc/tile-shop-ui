import httpRequest, { axiosPrivate } from '~/utils/httpRequest';

export const getStoreInfo = () => {
    return httpRequest.get('store-info');
};

export const updateStoreInfo = (values, logo, logoSmall, bannerImage, backgroundImage) => {
    const formData = new FormData();
    formData.append('store', new Blob([JSON.stringify(values)], { type: 'application/json' }));

    if (logo) {
        formData.append('logo', logo);
    }

    if (logoSmall) {
        formData.append('logoSmall', logoSmall);
    }

    if (bannerImage) {
        formData.append('bannerImage', bannerImage);
    }

    if (backgroundImage) {
        formData.append('backgroundImage', backgroundImage);
    }

    return axiosPrivate.put('store-info', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
