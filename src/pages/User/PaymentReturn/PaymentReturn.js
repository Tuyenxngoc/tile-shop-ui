import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { handleVnpayReturn } from '~/services/paymentService';

import classNames from 'classnames/bind';
import styles from './PaymentReturn.module.scss';
import useAuth from '~/hooks/useAuth';
import { Alert, Spin } from 'antd';
import { formatCurrency } from '~/utils';
import images from '~/assets';

const cx = classNames.bind(styles);

const paymentMethodLabels = {
    COD: 'Thanh toán khi nhận hàng',
    VNPAY: 'Thanh toán qua VNPAY',
    MOMO: 'Thanh toán qua MOMO',
    ZALOPAY: 'Thanh toán qua ZaloPay',
};

const paymentStatusLabels = {
    PENDING: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    FAILED: 'Thanh toán thất bại',
};

const PaymentReturn = () => {
    const { user } = useAuth();
    const location = useLocation();

    const [result, setResult] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const queryParams = new URLSearchParams(location.search);
                const response = await handleVnpayReturn(queryParams);

                const { data } = response.data;
                setResult(data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentInfo();
    }, [location.search]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center w-100">
                <Spin size="large" />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-100">
                <Alert message="Lỗi" description={errorMessage} type="error" />
            </div>
        );
    }

    return (
        <div className="container text-center">
            <div className="mx-auto col-md-8">
                <img src={images.success} width={64} alt="order status" className="mt-5 mb-3" />
                <h4 className="mb-4">Đặt hàng thành công</h4>

                <div className={cx('success-box')}>
                    <div className={cx('text-start', 'order-info')}>
                        <p>
                            <strong>Chào {user.fullName},</strong>
                            <br />
                            Chúc mừng bạn đã đặt hàng thành công sản phẩm của shop <strong>HUNGHUONG.COM.VN</strong>
                        </p>
                        <p>
                            <strong> Mã đơn hàng: </strong> {result.orderId}
                            <br />
                            <strong> Phương thức thanh toán: </strong> {paymentMethodLabels[result.paymentMethod]}
                            <br />
                            <strong> Thời gian dự kiến giao hàng: </strong> 2 - 3 ngày
                            <br />
                            <strong> Tổng thanh toán: </strong>
                            <span className={cx('total-price')}>{formatCurrency(result.totalAmount)}</span>
                            <br />
                            <strong> Tình trạng: </strong>
                            <span className="text-danger">{paymentStatusLabels[result.paymentStatus]}</span>
                        </p>
                        <hr />
                        <p>
                            Mọi thông tin về đơn hàng sẽ được gửi tới email của bạn, vui lòng kiểm tra email để biết
                            thêm chi tiết.
                            <br />
                            Cảm ơn bạn đã tin tưởng và giao dịch tại{' '}
                            <a href="https://www.hunghuong.vn">www.hunghuong.vn</a>
                        </p>
                        <p>
                            <strong>Ban quản trị</strong>
                        </p>
                    </div>
                    <div className="d-flex justify-content-center mt-4 gap-3">
                        <Link to="/" className={cx('btn', 'btn-outline-secondary', 'btn-custom')}>
                            Tiếp tục mua sắm
                        </Link>
                        <Link to="/ho-so/don-hang" className={cx('btn', 'btn-outline-danger', 'btn-custom')}>
                            Chi tiết đơn hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentReturn;
