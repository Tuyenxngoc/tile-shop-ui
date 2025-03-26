import { axiosPrivate } from '~/utils/httpRequest';

export const uploadFiles = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    return axiosPrivate.post('users/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
