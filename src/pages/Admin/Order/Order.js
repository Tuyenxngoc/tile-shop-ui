import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Button,
    Col,
    DatePicker,
    Dropdown,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Space,
    Table,
    Tabs,
    Typography,
} from 'antd';
import { MdOutlineModeEdit } from 'react-icons/md';
import { DeleteOutlined, DownOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

import { formatCurrency } from '~/utils';
import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { orderStatusTags } from '~/constants/order';
import {
    cancelOrder,
    exportOrderReport,
    getOrderCountByStatus,
    getOrders,
    printInvoice,
    updateOrderStatus,
} from '~/services/ordersService';

const { RangePicker } = DatePicker;

const orderFilterOptions = [
    { value: 'id', label: 'Mã đơn hàng' },
    { value: 'fullName', label: 'Tên người mua' },
    { value: 'productName', label: 'Sản phẩm' },
];

const paymentOptions = [
    { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)' },
    { value: 'VNPAY', label: 'Thanh toán qua VNPAY' },
    { value: 'MOMO', label: 'Thanh toán qua MOMO' },
    { value: 'ZALOPAY', label: 'Thanh toán qua ZALOPAY' },
];

const allowedTransitions = {
    PENDING: ['CONFIRMED'],
    CONFIRMED: ['DELIVERING'],
    DELIVERING: ['DELIVERED', 'RETURNED'],
    DELIVERED: ['RETURNED'],
    CANCELLED: [],
    RETURNED: [],
};

const cancelReasonOptions = [
    {
        value: 'customerRequest',
        label: 'Khách yêu cầu hủy đơn',
    },
    {
        value: 'outOfStock',
        label: 'Sản phẩm hết hàng',
    },
    {
        value: 'invalidOrder',
        label: 'Đơn hàng không hợp lệ',
    },
    {
        value: 'fraudDetection',
        label: 'Phát hiện gian lận / bất thường',
    },
    {
        value: 'duplicateOrder',
        label: 'Đơn hàng trùng lặp',
    },
    {
        value: 'other',
        label: 'Lý do khác',
    },
];

const getAvailableStatuses = (currentStatus) => {
    return allowedTransitions[currentStatus] || [];
};

const renderTabLabel = (label, count) => (
    <span>
        {label}
        {count > 0 && (
            <Typography.Text type="secondary" style={{ marginLeft: 6, opacity: 0.65 }}>
                ({count})
            </Typography.Text>
        )}
    </span>
);

function Order() {
    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [orderCounts, setOrderCounts] = useState({});
    const [entityData, setEntityData] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(orderFilterOptions[0].value);
    const [createdAtRange, setCreatedAtRange] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [minTotalAmount, setMinTotalAmount] = useState(null);
    const [maxTotalAmount, setMaxTotalAmount] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage }));
    };

    const handleChangeRowsPerPage = (current, size) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            pageSize: size,
        }));
    };

    const handleSortChange = (pagination, filters, sorter) => {
        const sortOrder = sorter.order === 'ascend' ? true : sorter.order === 'descend' ? false : undefined;
        setFilters((prev) => ({
            ...prev,
            sortBy: sorter.field,
            isAscending: sortOrder,
        }));
    };

    const filterOrdersByStatus = (key) => {
        setFilters((prev) => ({
            ...prev,
            status: key === 'ALL' ? null : key,
        }));
    };

    const handleApplyFilters = () => {
        if (minTotalAmount !== null && maxTotalAmount !== null && minTotalAmount > maxTotalAmount) {
            messageApi.error('Giá từ không được lớn hơn giá đến.');
            return;
        }

        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: activeFilterOption,
            keyword: searchInput,
            paymentMethod: paymentMethod || null,
            minTotalAmount: minTotalAmount !== null ? minTotalAmount : null,
            maxTotalAmount: maxTotalAmount !== null ? maxTotalAmount : null,
            fromDate: createdAtRange?.[0]
                ? dayjs(createdAtRange[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss')
                : null,
            toDate: createdAtRange?.[1] ? dayjs(createdAtRange[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
        }));
    };

    const handleResetFilters = () => {
        setSearchInput('');
        setActiveFilterOption(orderFilterOptions[0].value);
        setCreatedAtRange([]);
        setPaymentMethod(null);
        setMinTotalAmount(null);
        setMaxTotalAmount(null);
        setFilters(INITIAL_FILTERS);
    };

    const openCancelOrderModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsCancelOrderModalOpen(true);
    };

    const closeCancelOrderModal = () => {
        setIsCancelOrderModalOpen(false);
    };

    const handleCancelReasonChange = (value) => {
        setCancelReason(value);
        if (value !== 'other') {
            setOtherReason('');
        }
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
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            messageApi.error(errorMessage);
        }
    };

    const handleChangeStatus = async (orderId, newStatus) => {
        try {
            const response = await updateOrderStatus(orderId, newStatus);
            if (response.status === 200) {
                const { data, message } = response.data.data;
                messageApi.success(message);

                setEntityData((prevData) => prevData.map((item) => (item.id === orderId ? data : item)));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            messageApi.error(errorMessage);
        }
    };

    const handlePrintOrder = async (orderId) => {
        try {
            const response = await printInvoice(orderId);
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            messageApi.error(errorMessage);
        }
    };

    const handleExportReport = async () => {
        try {
            const response = await exportOrderReport(filters);
            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'Order.xlsx';
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (fileNameMatch && fileNameMatch.length > 1) {
                        fileName = fileNameMatch[1];
                    }
                }
                saveAs(blob, fileName);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            messageApi.error(errorMessage);
        }
    };

    useEffect(() => {
        const fetchOrderCounts = async () => {
            try {
                const response = await getOrderCountByStatus();
                setOrderCounts(response.data.data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || 'Lỗi khi lấy số lượng đơn hàng. Vui lòng thử lại.';
                messageApi.error(errorMessage);
            }
        };

        fetchOrderCounts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getOrders(filters);
                const { meta, items } = response.data.data;
                setEntityData(items);
                setMeta(meta);
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            showSorterTooltip: false,
            render: (id) => <strong>{id}</strong>,
        },
        {
            title: 'Thời gian đặt hàng',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (createdDate) => dayjs(createdDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'recipientName',
            key: 'recipientName',
        },
        {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (paymentMethod) => <strong>{paymentMethod}</strong>,
        },
        {
            title: 'Số tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: true,
            showSorterTooltip: false,
            render: (amountValue) => <strong>{formatCurrency(amountValue)}</strong>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            showSorterTooltip: false,
            align: 'center',
            render: (status, record) => {
                const statusItems = getAvailableStatuses(record.status).map((statusKey) => ({
                    key: statusKey,
                    label: orderStatusTags[statusKey] || statusKey,
                }));

                if (statusItems.length === 0) {
                    return orderStatusTags[status];
                }

                return (
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: statusItems,
                            onClick: ({ key }) => handleChangeStatus(record.id, key),
                        }}
                    >
                        <Button size="small" type="text">
                            {orderStatusTags[status]} <DownOutlined />
                        </Button>
                    </Dropdown>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space direction="vertical">
                    <Space>
                        <Button
                            size="small"
                            type="text"
                            icon={<MdOutlineModeEdit />}
                            onClick={() => navigate(`edit/${record.id}`)}
                        >
                            Chỉnh sửa
                        </Button>

                        <Button
                            size="small"
                            type="text"
                            icon={<PrinterOutlined />}
                            onClick={() => handlePrintOrder(record.id)}
                        >
                            In hóa đơn
                        </Button>
                    </Space>

                    <Button
                        danger
                        size="small"
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => openCancelOrderModal(record.id)}
                    >
                        Hủy đơn
                    </Button>
                </Space>
            ),
        },
    ];

    const orderStatusOptions = useMemo(
        () => [
            { key: 'ALL', label: renderTabLabel('Tất cả', 0) },
            { key: 'PENDING', label: renderTabLabel('Chờ xác nhận', orderCounts.PENDING || 0) },
            { key: 'CONFIRMED', label: renderTabLabel('Đã xác nhận', orderCounts.CONFIRMED || 0) },
            { key: 'DELIVERING', label: renderTabLabel('Đang giao', orderCounts.DELIVERING || 0) },
            { key: 'DELIVERED', label: renderTabLabel('Đã giao', orderCounts.DELIVERED || 0) },
            { key: 'RETURNED', label: renderTabLabel('Trả hàng', orderCounts.RETURNED || 0) },
            { key: 'CANCELLED', label: renderTabLabel('Đã hủy', orderCounts.CANCELLED || 0) },
        ],
        [orderCounts],
    );

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <div>
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
                    Bạn sắp thực hiện thao tác hủy đơn hàng này. Vui lòng chọn lý do hủy để lưu lại lịch sử xử lý đơn
                    hàng.
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

            <Flex wrap justify="space-between" align="center">
                <h2>Quản lý đơn hàng</h2>
                <Button type="primary" onClick={handleExportReport}>
                    Xuất báo cáo
                </Button>
            </Flex>

            <Tabs activeKey={filters.status || 'ALL'} onChange={filterOrdersByStatus} items={orderStatusOptions} />

            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} md={12}>
                    <Space.Compact className="my-2 w-100">
                        <Select
                            options={orderFilterOptions}
                            disabled={isLoading}
                            value={activeFilterOption}
                            onChange={(value) => setActiveFilterOption(value)}
                            style={{ width: 200 }}
                        />
                        <Input
                            allowClear
                            name="searchInput"
                            placeholder="Nhập từ cần tìm..."
                            disabled={isLoading}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            suffix={<SearchOutlined />}
                            className="w-100"
                        />
                    </Space.Compact>
                </Col>

                <Col xs={24} md={12}>
                    <Row align="middle" gutter={8}>
                        <Col>
                            <label htmlFor="createdAtRange">Ngày tạo đơn</label>
                        </Col>
                        <Col flex="auto">
                            <RangePicker
                                id="createdAtRange"
                                name="createdAtRange"
                                className="w-100"
                                disabled={isLoading}
                                value={createdAtRange}
                                onChange={(values) => setCreatedAtRange(values)}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} md={12}>
                    <Row align="middle" gutter={8}>
                        <Col>
                            <label htmlFor="paymentOptions">Phương thức thanh toán</label>
                        </Col>
                        <Col flex="auto">
                            <Select
                                id="paymentOptions"
                                options={paymentOptions}
                                allowClear
                                className="w-100"
                                disabled={isLoading}
                                value={paymentMethod}
                                onChange={(value) => setPaymentMethod(value)}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} md={6}>
                    <Row align="middle" gutter={8}>
                        <Col>
                            <label htmlFor="minTotalAmount">Giá từ</label>
                        </Col>
                        <Col flex="auto">
                            <InputNumber
                                id="minTotalAmount"
                                placeholder="Giá từ"
                                className="w-100"
                                disabled={isLoading}
                                value={minTotalAmount}
                                onChange={(value) => setMinTotalAmount(value)}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} md={6}>
                    <Row align="middle" gutter={8}>
                        <Col>
                            <label htmlFor="maxTotalAmount">Giá đến</label>
                        </Col>
                        <Col flex="auto">
                            <InputNumber
                                id="maxTotalAmount"
                                placeholder="Giá đến"
                                className="w-100"
                                disabled={isLoading}
                                value={maxTotalAmount}
                                onChange={(value) => setMaxTotalAmount(value)}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col span={24} style={{ textAlign: 'right' }}>
                    <Space>
                        <Button type="primary" loading={isLoading} onClick={handleApplyFilters}>
                            Áp dụng
                        </Button>
                        <Button type="default" loading={isLoading} onClick={handleResetFilters}>
                            Đặt lại
                        </Button>
                    </Space>
                </Col>
            </Row>

            <div className="fw-bold fs-5">{orderCounts.ALL || 0} Đơn hàng</div>

            <Table
                bordered
                rowKey="id"
                scroll={{ x: 'max-content' }}
                dataSource={entityData}
                columns={columns}
                loading={isLoading}
                onChange={handleSortChange}
                pagination={{
                    current: filters.pageNum,
                    pageSize: filters.pageSize,
                    total: meta.totalElements,
                    onChange: handleChangePage,
                    showSizeChanger: true,
                    onShowSizeChange: handleChangeRowsPerPage,
                }}
            />
        </div>
    );
}

export default Order;
