import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Descriptions, Image, Spin, Table, Tooltip } from 'antd';

import { getOrderById } from '~/services/ordersService';
import { formatCurrency, formatDate } from '~/utils';
import { checkIdIsNumber } from '~/utils/helper';
import { genderTags } from '~/constants/gender';
import {
    deliveryMethodLabelMap,
    orderStatusTags,
    paymentMethodLabelMap,
    paymentStatusLabelMap,
} from '~/constants/order';

function OrdersDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!id) return;

        if (!checkIdIsNumber(id)) {
            navigate(-1);
            return;
        }

        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getOrderById(id);
                const { data } = response.data;
                setOrder(data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center w-100">
                <Spin size="large" />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-100">
                <Alert message="Lỗi" description={errorMessage} type="error" />
            </div>
        );
    }

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: ['product', 'imageUrl'],
            key: 'image',
            render: (text) => (
                <Image
                    src={text}
                    alt="review"
                    width={56}
                    height={56}
                    preview={{ mask: 'Xem ảnh' }}
                    className="rounded-2"
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product) => (
                <div style={{ maxWidth: 300 }}>
                    <Tooltip title={product.name}>
                        <Link to={`/san-pham/${product.slug}`} className="text-truncate-2">
                            {product.name}
                        </Link>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'priceAtTimeOfOrder',
            key: 'price',
            render: (text) => formatCurrency(text),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (record) => formatCurrency(record.priceAtTimeOfOrder * record.quantity),
        },
    ];

    return (
        <>
            <Button icon={<LeftOutlined />} type="link" onClick={() => navigate(-1)} className="mb-4">
                TRỞ LẠI
            </Button>

            <h2 className="mb-4">Chi tiết đơn hàng #{order.id}</h2>

            <Card title="Thông tin đơn hàng" className="mb-4">
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Ngày tạo">{formatDate(order.createdDate)}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {orderStatusTags[order.status] || order.status}
                    </Descriptions.Item>

                    <Descriptions.Item label="Người nhận">{order.recipientName}</Descriptions.Item>
                    <Descriptions.Item label="Giới tính">
                        {genderTags[order.recipientGender] || order.recipientGender}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{order.recipientPhone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{order.recipientEmail}</Descriptions.Item>

                    <Descriptions.Item label="Phương thức giao hàng">
                        {deliveryMethodLabelMap[order.deliveryMethod] || order.deliveryMethod}
                    </Descriptions.Item>
                    {order.deliveryMethod === 'HOME_DELIVERY' && (
                        <Descriptions.Item label="Địa chỉ giao">{order.shippingAddress}</Descriptions.Item>
                    )}

                    <Descriptions.Item label="Phương thức thanh toán">
                        {paymentMethodLabelMap[order.paymentMethod] || order.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                        {paymentStatusLabelMap[order.paymentStatus] || order.paymentStatus}
                    </Descriptions.Item>
                    {order.paymentTime && (
                        <Descriptions.Item label="Thời gian thanh toán">
                            {formatDate(order.paymentTime)}
                        </Descriptions.Item>
                    )}

                    <Descriptions.Item label="Ghi chú">{order.note}</Descriptions.Item>
                    {order.status === 'CANCELED' && (
                        <Descriptions.Item label="Lý do hủy">{order.cancelReason}</Descriptions.Item>
                    )}

                    <Descriptions.Item label="Tổng tiền">
                        <strong>{formatCurrency(order.totalAmount)}</strong>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Danh sách sản phẩm">
                <Table rowKey="id" dataSource={order.orderItems} columns={columns} pagination={false} />
            </Card>
        </>
    );
}

export default OrdersDetail;
