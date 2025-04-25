import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Flex, Input, message, Select, Space, Table, Tabs } from 'antd';
import { MdOutlineModeEdit } from 'react-icons/md';

import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import { getOrders } from '~/services/ordersService';
import { formatCurrency } from '~/utils';

const orderFilterOptions = [
    { value: 'id', label: 'Mã đơn hàng' },
    { value: 'fullName', label: 'Tên người mua' },
    { value: 'productName', label: 'Sản phẩm' },
];

const orderStatusOptions = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'PROCESSING', label: 'Đang xử lý' },
    { key: 'DELIVERING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'CANCELLED', label: 'Đã huỷ' },
];

function Order() {
    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [entityData, setEntityData] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(orderFilterOptions[0].value);

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

    const handleSearch = (searchBy, keyword) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: searchBy || activeFilterOption,
            keyword: keyword || searchInput,
        }));
    };

    const updateOrderStatus = (key) => {
        setFilters((prev) => ({
            ...prev,
            status: key === 'ALL' ? null : key,
        }));
    };

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
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<MdOutlineModeEdit />} onClick={() => navigate(`edit/${record.id}`)} />
                </Space>
            ),
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

            <Flex justify="space-between">
                <Space.Compact className="my-2">
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
                        value={searchInput}
                        disabled={isLoading}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </Space.Compact>

                <Space>
                    <Button type="primary">Áp dụng</Button>

                    <Button type="default">Đặt lại</Button>
                </Space>
            </Flex>

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
