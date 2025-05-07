import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { BiSolidDollarCircle } from 'react-icons/bi';
import { BsFillBagFill, BsPersonCircle } from 'react-icons/bs';
import { AiFillProduct } from 'react-icons/ai';

import useAuth from '~/hooks/useAuth';
import StatCard from '~/components/StatCard';

const { RangePicker } = DatePicker;

function Dashboard() {
    const {
        user: { username, fullName },
    } = useAuth();
    const navigate = useNavigate();

    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState(null);
    const [dates, setDates] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);

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
                        amount={559.25}
                        unit={'$'}
                        percentage={16.24}
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
                        amount={36894}
                        percentage={-3.57}
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
                        amount={18335}
                        percentage={29.08}
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
                        amount={165}
                        percentage={0.0}
                        link="/admin/products"
                        linkLabel="Xem danh sách sản phẩm"
                        iconComponent={AiFillProduct}
                        iconBg="bg-primary-subtle"
                        iconColor="text-primary"
                    />
                </div>
            </div>
        </>
    );
}

export default Dashboard;
