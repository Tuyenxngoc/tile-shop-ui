import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { orderStatusTags } from '~/constants/order';
import useStore from '~/hooks/useStore';
import { formatCurrency, formatDate } from '~/utils';

const renderActions = (status, onCancelOrder, onReviewOrder, onReorder) => {
    switch (status) {
        case 'PENDING':
            return (
                <Button type="default" onClick={onCancelOrder}>
                    Hủy đơn hàng
                </Button>
            );
        case 'DELIVERED':
            return (
                <>
                    <Button type="primary" onClick={onReviewOrder}>
                        Đánh giá
                    </Button>
                    <Button type="primary" onClick={onReorder}>
                        Mua lại
                    </Button>
                </>
            );
        default:
            return null;
    }
};

function OrderItem({ data, onCancelOrder, onRetryPayment }) {
    const { phone, phoneSupport } = useStore();
    const navigate = useNavigate();

    const handleReviewOrder = () => {
        navigate('/');
    };

    const handleReorder = () => {
        navigate('/');
    };

    const handleViewDetails = () => {
        navigate(`${data.id}`);
    };

    const handleContactSupport = () => {
        const supportPhoneNumber = phone || phoneSupport;
        const phoneUrl = `tel:${supportPhoneNumber}`;
        window.location.href = phoneUrl;
    };

    return (
        <div className="row g-3">
            <div className="col-12 d-flex justify-content-between">
                <div>
                    Ngày đặt hàng: <span className="fw-bold">{formatDate(data.createdDate)}</span>
                </div>
                <div>Trạng thái: {orderStatusTags[data.status]}</div>
            </div>

            <div className="col-12">
                {data.orderItems.map((item, index) => {
                    const product = item.product;
                    return (
                        <div key={index} className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="rounded-2 me-2"
                                    style={{ width: '52px', height: '52px', objectFit: 'cover' }}
                                />
                                <div>
                                    <div className="text-truncate-2">{product.name}</div>
                                    <div className="text-muted">{product.category.name}</div>
                                </div>
                            </div>
                            <div className="text-end">
                                {formatCurrency(item.priceAtTimeOfOrder)} x {item.quantity}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="col-12 text-end">
                <div className="fw-bold mb-3">
                    Tổng tiền: <span className="text-danger fs-3">{formatCurrency(data.totalAmount)}</span>
                </div>
                <Space wrap>
                    {renderActions(data.status, onCancelOrder, handleReviewOrder, handleReorder)}
                    {data.status === 'PENDING' && data.paymentMethod !== 'COD' && data.paymentStatus !== 'PAID' && (
                        <Button key="retry" type="primary" onClick={onRetryPayment}>
                            Thanh toán lại
                        </Button>
                    )}
                    <Button type="default" onClick={handleViewDetails}>
                        Xem chi tiết
                    </Button>
                    <Button type="default" onClick={handleContactSupport}>
                        Liên hệ hỗ trợ
                    </Button>
                </Space>
            </div>
        </div>
    );
}

export default OrderItem;
