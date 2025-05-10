import { useEffect, useState } from 'react';
import { Alert, Empty, Input, Spin, Tabs, Modal, Select, Form } from 'antd';

import useDebounce from '~/hooks/useDebounce';
import { getAllOrdersForUser } from '~/services/ordersService';
import { orderStatusOptions } from '~/constants/order';
import OrderItem from '~/components/OrderItem';

function Orders() {
    const [filters, setFilters] = useState({ status: null, keyword: '' });

    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        console.log('Lý do hủy:', cancelReason === 'other' ? otherReason : cancelReason);
        setIsModalOpen(false);
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
        <div>
            <Modal
                title="Lý Do Hủy"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
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
                        >
                            <Select.Option value="updateAddress">
                                Tôi muốn cập nhật địa chỉ/sđt nhận hàng.
                            </Select.Option>
                            <Select.Option value="applyDiscount">Tôi muốn thêm/thay đổi Mã giảm giá</Select.Option>
                            <Select.Option value="changeProduct">
                                Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng…)
                            </Select.Option>
                            <Select.Option value="paymentIssue">Thủ tục thanh toán rắc rối</Select.Option>
                            <Select.Option value="betterPrice">
                                Tôi tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn, giao nhanh hơn…)
                            </Select.Option>
                            <Select.Option value="noNeed">Tôi không có nhu cầu mua nữa</Select.Option>
                            <Select.Option value="other">Tôi không tìm thấy lý do hủy phù hợp</Select.Option>
                        </Select>
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
                entityData.map((order) => (
                    <OrderItem key={order.id} data={order} onCancelOrder={() => showModal(order.id)} />
                ))
            )}
        </div>
    );
}

export default Orders;
