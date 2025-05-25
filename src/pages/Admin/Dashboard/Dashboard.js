import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, DatePicker, message, Spin, Table, Tag, Card, Select } from 'antd';
import dayjs from 'dayjs';

import { BiSolidDollarCircle } from 'react-icons/bi';
import { BsFillBagFill, BsPersonCircle } from 'react-icons/bs';
import { AiFillProduct } from 'react-icons/ai';
import { ResponsiveBar } from '@nivo/bar';

import useAuth from '~/hooks/useAuth';
import StatCard from '~/components/StatCard';
import {
    getDashboardStatistics,
    getTopSellingProducts,
    getTopCustomers,
    getRecentOrders,
    getRevenueStats,
} from '~/services/statisticsService';
import { formatCurrency, formatDate } from '~/utils';
import { orderStatusTags } from '~/constants/order';

const formatLabel = (timestamp, statType) => {
    switch (statType) {
        case 'day':
            return dayjs.unix(timestamp).format('HH:mm'); // giờ phút trong ngày
        case 'week':
            return dayjs.unix(timestamp).format('DD/MM'); // ngày/tháng trong tuần
        case 'month':
            return dayjs.unix(timestamp).format('DD'); // ngày trong tháng
        case 'year':
            return dayjs.unix(timestamp).format('MM/YYYY'); // tháng/năm
        default:
            return dayjs.unix(timestamp).format('DD/MM');
    }
};

const timePeriodOptions = [
    { value: 'day', label: 'Ngày' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' },
];

function Dashboard() {
    const {
        user: { username, fullName },
    } = useAuth();
    const navigate = useNavigate();

    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    const [overviewDate, setOverviewDate] = useState(dayjs());
    const [chartDate, setChartDate] = useState(dayjs());
    const [statType, setStatType] = useState('week');
    const [revenueData, setRevenueData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const hour = dayjs().hour();
        if (hour >= 5 && hour < 12) {
            setGreeting('Chào buổi sáng');
        } else if (hour >= 12 && hour < 18) {
            setGreeting('Chào buổi chiều');
        } else {
            setGreeting('Chào buổi tối');
        }
    }, []);

    useEffect(() => {
        const fetchOverviewStats = async () => {
            try {
                const response = await getDashboardStatistics({ date: overviewDate.format('YYYY-MM-DD') });
                setStats(response.data.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
                messageApi.error(errorMessage);
            }
        };

        fetchOverviewStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overviewDate]);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const response = await getRevenueStats({
                    date: chartDate.format('YYYY-MM-DD'),
                    type: statType,
                });
                const { data } = response.data;
                setRevenueData(
                    data.map((item) => ({
                        label: formatLabel(item.timestamp, statType),
                        value: item.value,
                    })),
                );
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
                messageApi.error(errorMessage);
            }
        };

        fetchRevenue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartDate, statType]);

    useEffect(() => {
        const fetchTopData = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const [productsRes, customersRes, ordersRes] = await Promise.all([
                    getTopSellingProducts(),
                    getTopCustomers(),
                    getRecentOrders(),
                ]);

                setTopProducts(productsRes.data.data);
                setTopCustomers(customersRes.data.data);
                setRecentOrders(ordersRes.data.data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopData();
    }, []);

    const productColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                        src={record.imageUrl}
                        alt={record.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div>
                        <Link to={`/san-pham/${record.slug}`} style={{ fontWeight: 600 }}>
                            {record.name}
                        </Link>
                        <div style={{ color: '#888' }}>{record.category?.name}</div>
                    </div>
                </div>
            ),
        },
        { title: 'Giá bán', dataIndex: 'salePrice', key: 'salePrice', render: (text) => formatCurrency(text) },
        { title: 'Số lượng bán', dataIndex: 'totalQuantity', key: 'totalQuantity' },
        {
            title: 'Tồn kho',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (text) => (text === 0 ? <Tag color="red">Hết hàng</Tag> : text),
        },
        { title: 'Doanh thu', dataIndex: 'totalAmount', key: 'totalAmount', render: (text) => formatCurrency(text) },
    ];

    const customerColumns = [
        {
            title: 'Khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (text ? text : record.username),
        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số đơn hàng', dataIndex: 'totalOrders', key: 'totalOrders' },
        {
            title: 'Tổng chi tiêu',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            render: (text) => formatCurrency(text),
        },
    ];

    const recentOrdersColumns = [
        { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
            render: (customer) => <Link to={`/admin/users`}>{customer.fullName || customer.username}</Link>,
        },
        { title: 'Ngày', dataIndex: 'createdDate', key: 'createdDate', render: (text) => formatDate(text) },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (text) => orderStatusTags[text] },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', render: (text) => formatCurrency(text) },
    ];

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center w-100">
                <Spin size="large" />
            </div>
        );
    }

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <>
            {contextHolder}

            <div className="row mb-3 pb-1">
                <div className="col-12">
                    <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                        <div className="flex-grow-1">
                            <h4 className="fs-16 mb-1">
                                {greeting}, {fullName || username}!
                            </h4>
                            <p className="text-muted mb-0">Đây là tổng quan hoạt động cửa hàng của bạn hôm nay.</p>
                        </div>

                        <div className="mt-3 mt-lg-0">
                            <div className="row g-3 mb-0 align-items-center">
                                <div className="col-sm-auto">
                                    <DatePicker
                                        name="overviewDate"
                                        value={overviewDate}
                                        onChange={(date) => setOverviewDate(date)}
                                        format="DD/MM/YYYY"
                                        allowClear={false}
                                    />
                                </div>

                                <div className="col-auto">
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigate('/admin/products/new')}
                                    >
                                        Thêm sản phẩm
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        title="Tổng doanh thu"
                        amount={stats?.revenueStat?.totalRevenue || 0}
                        unit={stats?.revenueStat?.currency || 'VND'}
                        percentage={stats?.revenueStat?.percentageChange || 0}
                        link="/"
                        linkLabel="Xem doanh thu chi tiết"
                        iconComponent={BiSolidDollarCircle}
                        iconBg="bg-success-subtle"
                        iconColor="text-success"
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        title="Tổng số đơn hàng"
                        amount={stats?.orderStat?.totalOrders || 0}
                        percentage={stats?.orderStat?.percentageChange || 0}
                        link="/admin/orders"
                        linkLabel="Xem tất cả các đơn hàng"
                        iconComponent={BsFillBagFill}
                        iconBg="bg-info-subtle"
                        iconColor="text-info"
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        title="Số khách hàng"
                        amount={stats?.customerStat?.totalCustomers || 0}
                        percentage={stats?.customerStat?.percentageChange || 0}
                        link="/admin/users"
                        linkLabel="Xem danh sách khách hàng"
                        iconComponent={BsPersonCircle}
                        iconBg="bg-warning-subtle"
                        iconColor="text-warning"
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        title="Số sản phẩm"
                        amount={stats?.productStat?.totalProducts || 0}
                        percentage={stats?.productStat?.percentageChange || 0}
                        link="/admin/products"
                        linkLabel="Xem danh sách sản phẩm"
                        iconComponent={AiFillProduct}
                        iconBg="bg-primary-subtle"
                        iconColor="text-primary"
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Doanh thu</h5>
                        <div className="d-flex gap-2">
                            <Select
                                value={statType}
                                onChange={(value) => setStatType(value)}
                                options={timePeriodOptions}
                                style={{ width: 120 }}
                            />
                            <DatePicker
                                name="chartDate"
                                picker={statType}
                                value={chartDate}
                                onChange={(date) => setChartDate(date)}
                                format={statType === 'year' ? 'YYYY' : statType === 'month' ? 'MM/YYYY' : 'DD/MM/YYYY'}
                                allowClear={false}
                            />
                        </div>
                    </div>

                    <div style={{ height: '500px' }}>
                        <ResponsiveBar
                            data={revenueData}
                            keys={['value']}
                            indexBy="label"
                            margin={{ top: 50, right: 30, bottom: 60, left: 80 }}
                            padding={0.25}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: revenueData.length > 8 ? -45 : 0,
                                legend:
                                    statType === 'day'
                                        ? 'Giờ'
                                        : statType === 'week'
                                        ? 'Ngày'
                                        : statType === 'month'
                                        ? 'Ngày'
                                        : 'Tháng',
                                legendPosition: 'middle',
                                legendOffset: 50,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                format: (value) => `${(value / 1000000).toFixed(1)}tr`,
                                legend: 'Doanh thu (VNĐ)',
                                legendPosition: 'middle',
                                legendOffset: -60,
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            animate={true}
                            tooltip={({ id, value, indexValue }) => (
                                <div style={{ padding: '6px 9px', background: '#fff', border: '1px solid #ddd' }}>
                                    <strong>{indexValue}</strong>: {value.toLocaleString()} VNĐ
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className="col-md-4"></div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Card title="Top sản phẩm bán chạy">
                        <Table
                            rowKey="id"
                            size="small"
                            columns={productColumns}
                            dataSource={topProducts}
                            pagination={false}
                        />
                    </Card>
                </div>
                <div className="col-md-6">
                    <Card title="Top khách hàng mua nhiều">
                        <Table
                            rowKey="id"
                            size="small"
                            columns={customerColumns}
                            dataSource={topCustomers}
                            pagination={false}
                        />
                    </Card>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <Card title="Đơn hàng gần đây">
                        <Table
                            rowKey="id"
                            size="small"
                            columns={recentOrdersColumns}
                            dataSource={recentOrders}
                            pagination={false}
                        />
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
