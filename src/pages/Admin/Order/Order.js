import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Button,
    Col,
    DatePicker,
    Dropdown,
    Flex,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
} from 'antd';
import { MdOutlineModeEdit } from 'react-icons/md';
import { DownOutlined, EyeOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { formatCurrency } from '~/utils';
import { INITIAL_FILTERS, INITIAL_META, orderStatusOptions } from '~/constants';
import { getOrders } from '~/services/ordersService';

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

export const orderStatusTags = {
    PENDING: <Tag color="gold">Chờ xác nhận</Tag>,
    CONFIRMED: <Tag color="blue">Đã xác nhận</Tag>,
    DELIVERING: <Tag color="geekblue">Đang giao</Tag>,
    DELIVERED: <Tag color="green">Đã giao</Tag>,
    RETURNED: <Tag color="volcano">Trả hàng</Tag>,
    CANCELLED: <Tag color="red">Đã hủy</Tag>,
};

const allowedTransitions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['DELIVERING', 'CANCELLED'],
    DELIVERING: ['DELIVERED', 'RETURNED'],
    DELIVERED: ['RETURNED'],
    CANCELLED: [],
    RETURNED: [],
};

const getAvailableStatuses = (currentStatus) => {
    return allowedTransitions[currentStatus] || [];
};

function Order() {
    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [entityData, setEntityData] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(orderFilterOptions[0].value);
    const [createdAtRange, setCreatedAtRange] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [minTotalAmount, setMinTotalAmount] = useState(null);
    const [maxTotalAmount, setMaxTotalAmount] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

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

    const updateOrderStatus = (key) => {
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

    const handlePrintInvoice = (orderId) => {};

    const handleMarkDelivered = (orderId) => {};

    const handleCancelOrder = (orderId) => {};

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getOrders(params);
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
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Tổng cộng',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: true,
            showSorterTooltip: false,
            render: (amountValue) => formatCurrency(amountValue),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            showSorterTooltip: false,
            align: 'center',
            render: (status) => orderStatusTags[status] || '-',
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => {
                const statusItems = getAvailableStatuses(record.status).map((status) => ({
                    key: status,
                    label: orderStatusTags[status]?.props?.children || status,
                }));
                return (
                    <Space>
                        <Dropdown
                            trigger={['click']}
                            menu={{
                                items: statusItems,
                                onClick: ({ key }) => console.log(record.id, key),
                            }}
                        >
                            <Button type="text">
                                {record.status} <DownOutlined />
                            </Button>
                        </Dropdown>
                        <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`detail/${record.id}`)} />
                        <Button type="text" icon={<PrinterOutlined />} onClick={() => handlePrintInvoice(record.id)} />

                        <Button
                            type="text"
                            icon={<MdOutlineModeEdit />}
                            onClick={() => navigate(`edit/${record.id}`)}
                        />
                    </Space>
                );
            },
        },
    ];

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <div>
            {contextHolder}

            <Flex wrap justify="space-between" align="center">
                <h2>Đơn hàng</h2>
                <Button type="primary" onClick={() => navigate('new')}>
                    Xuất báo cáo
                </Button>
            </Flex>

            <Tabs activeKey={filters.status || 'ALL'} onChange={updateOrderStatus} items={orderStatusOptions} />

            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} md={12}>
                    <Space.Compact className="my-2 w-100">
                        <Select
                            options={orderFilterOptions}
                            disabled={isLoading}
                            value={activeFilterOption}
                            onChange={(value) => setActiveFilterOption(value)}
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
