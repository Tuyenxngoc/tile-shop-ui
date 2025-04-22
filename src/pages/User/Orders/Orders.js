import { useEffect, useState } from 'react';
import { Alert, Input, Table, Tabs, Tooltip } from 'antd';

import queryString from 'query-string';

import { formatCurrency } from '~/utils';
import useDebounce from '~/hooks/useDebounce';

import { getAllOrdersForUser } from '~/services/ordersService';

const orderStatusOptions = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xử lý' },
    { key: 'DELIVERING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'CANCELLED', label: 'Đã huỷ' },
];

function Orders() {
    const [filters, setFilters] = useState({ status: null, keyword: '' });

    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const updateOrderStatus = (key) => {
        setFilters((prev) => ({
            ...prev,
            status: key === 'ALL' ? null : key,
        }));
    };

    useEffect(() => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            keyword: debouncedSearch,
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getAllOrdersForUser(params);
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tổng tiền (VNĐ)',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Phương thức giao hàng',
            dataIndex: 'deliveryMethod',
            key: 'deliveryMethod',
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'shippingAddress',
            key: 'shippingAddress',
            render: (text) => (
                <div style={{ maxWidth: 250 }}>
                    <Tooltip title={text}>
                        <span className="text-truncate-2">{text}</span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (text) => text || '—',
        },
        {
            title: 'Trạng thái thanh toán',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status) => status || 'Chưa thanh toán',
        },
        {
            title: 'Thời gian thanh toán',
            dataIndex: 'paymentTime',
            key: 'paymentTime',
            render: (time) => (time ? new Date(time).toLocaleString('vi-VN') : '—'),
        },
    ];

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <div>
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

            <Table
                bordered
                rowKey="id"
                scroll={{ x: 'max-content' }}
                dataSource={entityData}
                columns={columns}
                loading={isLoading}
                pagination={false}
            />
        </div>
    );
}

export default Orders;
