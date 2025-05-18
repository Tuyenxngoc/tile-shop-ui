import { useEffect, useState } from 'react';
import { Alert, Empty, Input, Spin, Tabs, Modal, Select, Form, message } from 'antd';

import useDebounce from '~/hooks/useDebounce';
import { getAllOrdersForUser, cancelOrder } from '~/services/ordersService';
import { orderStatusOptions } from '~/constants/order';
import OrderItem from '~/components/OrderItem';

const cancelReasonOptions = [
    {
        value: 'updateAddress',
        label: 'Tôi muốn cập nhật địa chỉ/sđt nhận hàng.',
    },
    {
        value: 'applyDiscount',
        label: 'Tôi muốn thêm/thay đổi Mã giảm giá',
    },
    {
        value: 'changeProduct',
        label: 'Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng…)',
    },
    {
        value: 'paymentIssue',
        label: 'Thủ tục thanh toán rắc rối',
    },
    {
        value: 'betterPrice',
        label: 'Tôi tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn, giao nhanh hơn…)',
    },
    {
        value: 'noNeed',
        label: 'Tôi không có nhu cầu mua nữa',
    },
    {
        value: 'other',
        label: 'Tôi không tìm thấy lý do hủy phù hợp',
    },
];

function Orders() {
    const [filters, setFilters] = useState({ status: null, keyword: '' });

    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const openCancelOrderModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsCancelOrderModalOpen(true);
    };

    const closeCancelOrderModal = () => {
        setIsCancelOrderModalOpen(false);
    };

    const handleConfirmCancelOrder = async () => {
        if (!cancelReason) {
            messageApi.error('Vui lòng chọn một lý do hủy đơn hàng.');
            return;
        }

        if (cancelReason === 'other' && !otherReason.trim()) {
            messageApi.error('Vui lòng nhập lý do hủy đơn hàng.');
            return;
        }

        const reasonToSend =
            cancelReason === 'other'
                ? otherReason
                : cancelReasonOptions.find((option) => option.value === cancelReason)?.label || '';

        try {
            const response = await cancelOrder(selectedOrderId, reasonToSend);
            if (response.status === 200) {
                const { data, message } = response.data.data;
                messageApi.success(message);

                // Cập nhật lại danh sách đơn hàng
                setEntityData((prevData) => prevData.map((item) => (item.id === selectedOrderId ? data : item)));
                closeCancelOrderModal();
            }
        } catch (error) {
            messageApi.error('Lỗi: ' + error.message);
        }
    };

    const handleCancelReasonChange = (value) => {
        setCancelReason(value);
        if (value !== 'other') {
            setOtherReason('');
        }
    };

    const updateOrderStatus = (key) => {
        setFilters((prev) => ({
            ...prev,
            status: key === 'ALL' ? null : key,
        }));
    };

    useEffect(() => {
        setFilters((prevFilters) => {
            if (prevFilters.keyword === debouncedSearch) return prevFilters;
            return {
                ...prevFilters,
                keyword: debouncedSearch,
            };
        });
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getAllOrdersForUser(filters);
                const { data } = response.data;
                setEntityData(data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, [filters]);

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <>
            {contextHolder}

            <Modal
                title="Lý Do Hủy"
                open={isCancelOrderModalOpen}
                onOk={handleConfirmCancelOrder}
                onCancel={closeCancelOrderModal}
                cancelText="Không phải bây giờ"
                okText="Hủy đơn hàng"
            >
                <p>
                    Bạn có biết? Bạn có thể cập nhật thông tin nhận hàng cho đơn hàng (1 lần duy nhất). Nếu bạn xác nhận
                    hủy, toàn bộ đơn hàng sẽ được hủy. Chọn lý do hủy phù hợp nhất với bạn nhé!
                </p>

                <Form>
                    <Form.Item label="Lý do hủy">
                        <Select
                            id="cancelReason"
                            value={cancelReason}
                            onChange={handleCancelReasonChange}
                            placeholder="Chọn lý do hủy"
                            options={cancelReasonOptions}
                        />
                    </Form.Item>

                    {cancelReason === 'other' && (
                        <Form.Item label="Lý do khác">
                            <Input
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder="Nhập lý do khác"
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            <Tabs activeKey={filters.status || 'ALL'} onChange={updateOrderStatus} items={orderStatusOptions} />

            <Input
                allowClear
                name="searchInput"
                placeholder="Tìm kiếm theo ID đơn hàng hoặc tên sản phẩm"
                value={searchTerm}
                disabled={isLoading}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

            {isLoading ? (
                <div className="d-flex justify-content-center w-100">
                    <Spin size="large" />
                </div>
            ) : entityData.length === 0 ? (
                <Empty description="Không có đơn hàng nào" />
            ) : (
                <div className="row g-3">
                    {entityData.map((order) => (
                        <div key={order.id} className="col-12">
                            <OrderItem data={order} onCancelOrder={() => openCancelOrderModal(order.id)} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Orders;
