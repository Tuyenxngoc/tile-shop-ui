import { useEffect, useState } from 'react';
import { Alert, Empty, Input, Spin, Tabs } from 'antd';

import useDebounce from '~/hooks/useDebounce';

import { getAllOrdersForUser } from '~/services/ordersService';
import { orderStatusOptions } from '~/constants';
import OrderItem from '~/components/OrderItem';

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
                entityData.map((order) => <OrderItem key={order.id} data={order} />)
            )}
        </div>
    );
}

export default Orders;
