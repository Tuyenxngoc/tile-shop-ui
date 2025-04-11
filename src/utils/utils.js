export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount).replace(/\./g, ',') + '₫';
};

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const validateFile = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        return { result: false, message: 'Bạn chỉ có thể upload file hình ảnh!' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return { result: false, message: 'Kích thước file không được vượt quá 5MB!' };
    }

    return { result: true, message: 'OK!' };
};
