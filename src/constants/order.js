import { Tag } from 'antd';

export const orderStatusOptions = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'DELIVERING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'RETURNED', label: 'Trả hàng' },
    { key: 'CANCELLED', label: 'Đã hủy' },
];

export const orderStatusTags = {
    PENDING: <Tag color="gold">Chờ xác nhận</Tag>,
    CONFIRMED: <Tag color="blue">Đã xác nhận</Tag>,
    DELIVERING: <Tag color="geekblue">Đang giao</Tag>,
    DELIVERED: <Tag color="green">Đã giao</Tag>,
    RETURNED: <Tag color="volcano">Trả hàng</Tag>,
    CANCELLED: <Tag color="red">Đã hủy</Tag>,
};

export const deliveryMethodLabelMap = {
    HOME_DELIVERY: 'Giao hàng tận nơi',
    STORE_PICKUP: 'Nhận tại cửa hàng',
};

export const paymentMethodLabelMap = {
    COD: 'Thanh toán khi nhận hàng (COD)',
    VNPAY: 'Thanh toán qua VNPAY',
};
