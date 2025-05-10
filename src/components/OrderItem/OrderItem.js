import { Button, Space, Tag } from 'antd';
import { formatCurrency } from '~/utils';

function OrderItem({ data }) {
    return (
        <div className="border rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Mã đơn: {data.id}</h4>
                <Tag color="blue">{data.status}</Tag>
            </div>

            <p>
                <strong>Tổng tiền:</strong> {formatCurrency(data.totalAmount)} VNĐ
            </p>
            <p>
                <strong>Phương thức giao hàng:</strong> {data.deliveryMethod}
            </p>
            <p>
                <strong>Địa chỉ giao hàng:</strong> {data.shippingAddress}
            </p>
            <p>
                <strong>Phương thức thanh toán:</strong> {data.paymentMethod}
            </p>
            <p>
                <strong>Ghi chú:</strong> {data.note || '—'}
            </p>
            <p>
                <strong>Trạng thái thanh toán:</strong> {data.paymentStatus || '—'}
            </p>
            <p>
                <strong>Thời gian thanh toán:</strong>{' '}
                {data.paymentTime ? new Date(data.paymentTime).toLocaleString('vi-VN') : '—'}
            </p>

            <Space className="mt-3">
                <Button type="primary">Xem chi tiết</Button>
                <Button>Hóa đơn</Button>
                {data.status === 'PENDING' && <Button danger>Huỷ đơn</Button>}
            </Space>
        </div>
    );
}

export default OrderItem;
