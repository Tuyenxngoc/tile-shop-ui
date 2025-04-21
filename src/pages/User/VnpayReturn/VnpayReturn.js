import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const VnpayReturn = () => {
    const [paymentInfo, setPaymentInfo] = useState({});
    const location = useLocation();

    useEffect(() => {
        // Lấy tất cả các tham số từ URL
        const queryParams = new URLSearchParams(location.search);

        // Gán các tham số vào state
        const paymentData = {
            amount: queryParams.get('vnp_Amount'),
            bankCode: queryParams.get('vnp_BankCode'),
            bankTranNo: queryParams.get('vnp_BankTranNo'),
            cardType: queryParams.get('vnp_CardType'),
            orderInfo: queryParams.get('vnp_OrderInfo'),
            payDate: queryParams.get('vnp_PayDate'),
            responseCode: queryParams.get('vnp_ResponseCode'),
            tmnCode: queryParams.get('vnp_TmnCode'),
            transactionNo: queryParams.get('vnp_TransactionNo'),
            transactionStatus: queryParams.get('vnp_TransactionStatus'),
            txnRef: queryParams.get('vnp_TxnRef'),
            secureHash: queryParams.get('vnp_SecureHash'),
        };

        setPaymentInfo(paymentData);
    }, [location.search]);

    return (
        <div>
            <h1>Thông tin thanh toán VNPAY</h1>
            <ul>
                <li>
                    <strong>Số tiền:</strong> {paymentInfo.amount}
                </li>
                <li>
                    <strong>Mã ngân hàng:</strong> {paymentInfo.bankCode}
                </li>
                <li>
                    <strong>Mã giao dịch ngân hàng:</strong> {paymentInfo.bankTranNo}
                </li>
                <li>
                    <strong>Loại thẻ:</strong> {paymentInfo.cardType}
                </li>
                <li>
                    <strong>Thông tin đơn hàng:</strong> {paymentInfo.orderInfo}
                </li>
                <li>
                    <strong>Ngày thanh toán:</strong> {paymentInfo.payDate}
                </li>
                <li>
                    <strong>Mã phản hồi:</strong> {paymentInfo.responseCode}
                </li>
                <li>
                    <strong>Mã TMN:</strong> {paymentInfo.tmnCode}
                </li>
                <li>
                    <strong>Mã giao dịch VNPAY:</strong> {paymentInfo.transactionNo}
                </li>
                <li>
                    <strong>Trạng thái giao dịch:</strong> {paymentInfo.transactionStatus}
                </li>
                <li>
                    <strong>Mã tham chiếu giao dịch:</strong> {paymentInfo.txnRef}
                </li>
                <li>
                    <strong>Secure Hash:</strong> {paymentInfo.secureHash}
                </li>
            </ul>
        </div>
    );
};

export default VnpayReturn;
