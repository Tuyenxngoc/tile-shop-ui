import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, DatePicker, message, Spin, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { BiSolidDollarCircle } from 'react-icons/bi';
import { BsFillBagFill, BsPersonCircle } from 'react-icons/bs';
import { AiFillProduct } from 'react-icons/ai';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

import useAuth from '~/hooks/useAuth';
import StatCard from '~/components/StatCard';
import {
    getDashboardStatistics,
    getTopSellingProducts,
    getTopCustomers,
    getRecentOrders,
} from '~/services/statisticsService';

const { RangePicker } = DatePicker;

const datatest = [
    { date: '2024-05-01', revenue: 1500000 },
    { date: '2024-05-02', revenue: 2200000 },
    { date: '2024-05-03', revenue: 1800000 },
    { date: '2024-05-04', revenue: 2000000 },
    { date: '2024-05-05', revenue: 2400000 },
];

const orderStatusData = [
    {
        id: 'stylus',
        label: 'stylus',
        value: 584,
        color: 'hsl(180, 70%, 50%)',
    },
    {
        id: 'lisp',
        label: 'lisp',
        value: 353,
        color: 'hsl(257, 70%, 50%)',
    },
    {
        id: 'css',
        label: 'css',
        value: 170,
        color: 'hsl(65, 70%, 50%)',
    },
    {
        id: 'javascript',
        label: 'javascript',
        value: 538,
        color: 'hsl(165, 70%, 50%)',
    },
    {
        id: 'make',
        label: 'make',
        value: 78,
        color: 'hsl(79, 70%, 50%)',
    },
];

function Dashboard() {
    const {
        user: { username, fullName },
    } = useAuth();
    const navigate = useNavigate();

    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    const [dates, setDates] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleAddProduct = () => {
        navigate('/admin/products/new');
    };

    const handleDateChange = (selectedDates) => {
        if (!selectedDates) {
            messageApi.info('Đã reset khoảng thời gian');
            return;
        }

        const [startDate, endDate] = selectedDates;

        // Validate ngày bắt đầu không được quá ngày hiện tại
        if (startDate.isAfter(dayjs(), 'day')) {
            messageApi.error('Ngày bắt đầu không được vượt quá hôm nay');
            return;
        }

        // Nếu hợp lệ thì set lại ngày
        setDates([startDate, endDate]);
    };

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
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const [dashboardRes, productsRes, customersRes, ordersRes] = await Promise.all([
                    getDashboardStatistics(),
                    getTopSellingProducts(),
                    getTopCustomers(),
                    getRecentOrders(),
                ]);

                setStats(dashboardRes.data.data);
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

        fetchEntities();
    }, []);

    const productColumns = [
        { title: 'Sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Số lượng bán', dataIndex: 'quantity', key: 'quantity' },
    ];

    const customerColumns = [
        { title: 'Khách hàng', dataIndex: 'username', key: 'username' },
        { title: 'Số đơn hàng', dataIndex: 'orders', key: 'orders' },
    ];

    const recentOrdersColumns = [
        { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
        { title: 'Ngày', dataIndex: 'createdDate', key: 'createdDate' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount' },
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
                                    <RangePicker
                                        name="date-picker"
                                        value={dates}
                                        onChange={handleDateChange}
                                        format="DD/MM/YYYY"
                                        allowClear
                                    />
                                </div>

                                <div className="col-auto">
                                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
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
                <div className="col-md-8" style={{ height: '400px' }}>
                    <h5>Doanh thu</h5>
                    <ResponsiveBar
                        data={datatest}
                        keys={['revenue']}
                        indexBy="date"
                        margin={{ top: 20, right: 100, bottom: 100, left: 70 }}
                        padding={0.3}
                        axisBottom={{
                            tickRotation: -45,
                            legend: 'Ngày',
                            legendPosition: 'middle',
                            legendOffset: 40,
                        }}
                        axisLeft={{
                            format: (value) => `${(value / 1000000).toFixed(1)}tr`,
                            legend: 'Doanh thu (VNĐ)',
                            legendPosition: 'middle',
                            legendOffset: -60,
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor="#fff"
                        colors="#4ade80"
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'top-right',
                                direction: 'column',
                                justify: false,
                                translateX: 120,
                                translateY: 0,
                                itemsSpacing: 2,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20,
                            },
                        ]}
                    />
                </div>
                <div className="col-md-4">
                    <ResponsivePie /* or Pie for fixed dimensions */
                        data={orderStatusData}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.6}
                        cornerRadius={2}
                        activeOuterRadiusOffset={8}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                translateY: 56,
                                itemWidth: 100,
                                itemHeight: 18,
                                symbolShape: 'circle',
                            },
                        ]}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h5>Top sản phẩm bán chạy</h5>
                    <Table columns={productColumns} dataSource={topProducts} pagination={false} size="small" bordered />
                </div>
                <div className="col-md-6">
                    <h5>Top khách hàng mua nhiều</h5>
                    <Table
                        columns={customerColumns}
                        dataSource={topCustomers}
                        pagination={false}
                        size="small"
                        bordered
                    />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <h5>Đơn hàng gần đây</h5>
                    <Table
                        columns={recentOrdersColumns}
                        dataSource={recentOrders}
                        pagination={false}
                        size="small"
                        bordered
                    />
                </div>
            </div>
        </>
    );
}

export default Dashboard;
