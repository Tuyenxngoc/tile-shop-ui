export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount).replace(/\./g, ',') + '₫';
};
