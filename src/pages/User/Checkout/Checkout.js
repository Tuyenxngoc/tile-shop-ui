import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Breadcrumb, Button, Checkbox, Input, notification, Radio, Spin } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';

import CheckoutItem from '~/components/CheckoutItem';
import ProvinceSelector from '~/components/ProvinceSelector';
import { TextAreaInput, TextInput } from '~/components/FormInput';
import { formatCurrency } from '~/utils';
import useAuth from '~/hooks/useAuth';
import useStore from '~/hooks/useStore';
import { getCartItems } from '~/services/cartService';
import { createOrder } from '~/services/ordersService';
import { createVnpayPaymentUrl } from '~/services/paymentService';
import { REGEXP_FULL_NAME, REGEXP_PHONE_NUMBER } from '~/constants';

const deliveryMethodOptions = [
    { value: 'HOME_DELIVERY', label: 'Giao hàng tận nơi' },
    { value: 'STORE_PICKUP', label: 'Nhận tại cửa hàng' },
];

const paymentMethodOptions = [
    { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)' },
    { value: 'VNPAY', label: 'Thanh toán qua VNPAY' },
];

const genderOptions = [
    { value: 'MALE', label: 'Anh' },
    { value: 'FEMALE', label: 'Chị' },
    { value: 'OTHER', label: 'Khác' },
];

const shippingFee = 0;

const defaultValue = {
    gender: genderOptions[0].value,
    fullName: '',
    phoneNumber: '',
    email: '',
    deliveryMethod: deliveryMethodOptions[0].value,
    shippingAddress: '',
    note: '',
    paymentMethod: paymentMethodOptions[0].value,
    requestInvoice: false,
    invoiceCompanyName: '',
    invoiceTaxCode: '',
    invoiceCompanyAddress: '',
};

const validationSchema = yup.object({
    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),

    phoneNumber: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .matches(REGEXP_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),

    fullName: yup
        .string()
        .required('Vui lòng nhập họ và tên')
        .matches(REGEXP_FULL_NAME, 'Họ và tên phải có ít nhất hai từ'),

    deliveryMethod: yup.string().trim().required('Vui lòng chọn phương thức giao hàng'),

    shippingAddress: yup
        .string()
        .trim()
        .when('deliveryMethod', {
            is: (val) => val === 'HOME_DELIVERY',
            then: () => yup.string().trim().required('Vui lòng chọn địa chỉ giao hàng'),
            otherwise: () => yup.string().nullable(),
        }),

    requestInvoice: yup.boolean(),

    invoiceCompanyName: yup
        .string()
        .trim()
        .when('requestInvoice', {
            is: true,
            then: () => yup.string().trim().required('Vui lòng nhập tên công ty'),
            otherwise: () => yup.string().nullable(),
        }),

    invoiceTaxCode: yup
        .string()
        .trim()
        .when('requestInvoice', {
            is: true,
            then: () => yup.string().trim().required('Vui lòng nhập mã số thuế'),
            otherwise: () => yup.string().nullable(),
        }),

    invoiceCompanyAddress: yup
        .string()
        .trim()
        .when('requestInvoice', {
            is: true,
            then: () => yup.string().trim().required('Vui lòng nhập địa chỉ công ty'),
            otherwise: () => yup.string().nullable(),
        }),
});

function Checkout() {
    const { user } = useAuth();
    const { storeInfo } = useStore();
    const navigate = useNavigate();

    const [checkoutItems, setCheckoutItems] = useState(null);

    const [isCartLoading, setIsCartLoading] = useState(true);
    const [cartErrorMessage, setCartErrorMessage] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);

    const [api, contextHolder] = notification.useNotification();

    const handleSubmit = async (values, { setSubmitting }) => {
        if (values.paymentMethod === 'VNPAY' && totalPrice < 10000) {
            api.error({
                message: 'Thanh toán không hợp lệ',
                description: 'Giá trị đơn hàng phải từ 10.000đ để thanh toán qua VNPAY.',
            });
            return;
        }

        try {
            const orderResponse = await createOrder(values);
            const {
                data: { orderId },
            } = orderResponse.data.data;

            if (values.paymentMethod === 'VNPAY') {
                try {
                    const response = await createVnpayPaymentUrl({ orderId: orderId });
                    const { url } = response.data.data;

                    // Redirect người dùng đến trang thanh toán VNPAY
                    window.location.href = url;
                } catch (error) {
                    api.error({
                        message: 'Lỗi thanh toán VNPAY',
                        description: error.response?.data?.message || 'Lỗi thanh toán qua VNPAY. Vui lòng thử lại sau.',
                    });
                }
            } else {
                navigate(`/thanh-toan/ket-qua?orderId=${orderId}&paymentMethod=COD&totalAmount=${totalPrice}`);
            }
        } catch (error) {
            api.error({
                message: 'Lỗi tạo đơn hàng',
                description: error.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            ...defaultValue,
            fullName: user.fullName || user.username || '',
            phoneNumber: user.phoneNumber || '',
            email: user.email || '',
            shippingAddress: user.address || '',
            gender: user.gender || genderOptions[0].value,
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        const fetchEntities = async () => {
            setIsCartLoading(true);
            setCartErrorMessage(null);
            try {
                const response = await getCartItems();
                const { data } = response.data;

                if (data.length === 0) {
                    navigate('/', { replace: true });
                } else {
                    setCheckoutItems(data);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setCartErrorMessage(errorMessage);
            } finally {
                setIsCartLoading(false);
            }
        };

        fetchEntities();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (checkoutItems && checkoutItems.length > 0) {
            const totalPrice = checkoutItems.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);

            setTotalPrice(totalPrice);
        } else {
            setTotalPrice(0);
        }
    }, [checkoutItems]);

    return (
        <div className="container">
            {contextHolder}

            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-md-4 order-md-2 py-5">
                        <h4 className="mb-3">Giỏ hàng của bạn</h4>
                        {isCartLoading ? (
                            <div className="d-flex justify-content-center w-100">
                                <Spin size="large" />
                            </div>
                        ) : cartErrorMessage ? (
                            <div className="w-100">
                                <Alert message="Lỗi" description={cartErrorMessage} type="error" />
                            </div>
                        ) : (
                            <>
                                <div className="mb-3">
                                    {checkoutItems.map((item, index) => (
                                        <CheckoutItem key={index} data={item} />
                                    ))}
                                </div>

                                {/* Mã giảm giá */}
                                <div className="d-flex gap-2 mb-3">
                                    <Input name="discountCode" placeholder="Mã giảm giá" />
                                    <Button type="primary">Sử dụng</Button>
                                </div>

                                {/* Tạm tính & phí ship */}
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Phí ship</span>
                                    <span>{formatCurrency(shippingFee)}</span>
                                </div>

                                <hr />

                                {/* Tổng tiền */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">Tổng tiền</span>
                                    <div>
                                        <span className="text-muted small me-1">VND</span>
                                        <span className="text-danger fw-bold fs-5">
                                            {formatCurrency(totalPrice + shippingFee)}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="col-md-8 order-md-1 pb-5 border-end bg-white">
                        <div className="row">
                            <div className="col-12">
                                <Breadcrumb
                                    className="py-4"
                                    separator=">"
                                    itemRender={(route) => {
                                        if (route.to) {
                                            return <Link to={route.to}>{route.title}</Link>;
                                        }
                                        return <span>{route.title}</span>;
                                    }}
                                    items={[
                                        { title: 'Trang chủ', to: '/' },
                                        { title: 'Giỏ hàng', to: '/gio-hang' },
                                        { title: 'Thanh toán' },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="col-12">
                                <h4 className="mb-3">Thông tin khách hàng</h4>
                            </div>

                            <div className="col-12">
                                <Radio.Group
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={(e) => formik.setFieldValue('gender', e.target.value)}
                                    options={genderOptions}
                                />
                            </div>

                            <TextInput
                                required
                                className="col-12"
                                id="fullName"
                                label="Họ tên người nhận"
                                placeholder="Nhập họ tên người nhận"
                                autoComplete="name"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : null
                                }
                            />

                            <TextInput
                                required
                                className="col-12"
                                id="phoneNumber"
                                label="Số điện thoại người nhận"
                                placeholder="Nhập số điện thoại người nhận"
                                autoComplete="tel"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.phoneNumber && formik.errors.phoneNumber
                                        ? formik.errors.phoneNumber
                                        : null
                                }
                            />

                            <TextInput
                                required
                                className="col-12"
                                id="email"
                                label="Email"
                                placeholder="Nhập email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                            />
                        </div>

                        <div className="row g-3 mt-4">
                            <div className="col-12">
                                <h4 className="mb-3">Chọn cách thức giao hàng</h4>

                                <Radio.Group
                                    name="deliveryMethod"
                                    value={formik.values.deliveryMethod}
                                    onChange={(e) => formik.setFieldValue('deliveryMethod', e.target.value)}
                                    options={deliveryMethodOptions}
                                />

                                {formik.values.deliveryMethod === 'STORE_PICKUP' && (
                                    <div className="mt-2">
                                        <strong>Địa chỉ nhận hàng tại cửa hàng:</strong>
                                        <div>{storeInfo.address}</div>
                                    </div>
                                )}

                                {formik.values.deliveryMethod === 'HOME_DELIVERY' && (
                                    <>
                                        <ProvinceSelector
                                            onChange={({ fullAddress }) =>
                                                formik.setFieldValue('shippingAddress', fullAddress)
                                            }
                                        />
                                        {formik.values.shippingAddress && (
                                            <div className="mt-2">
                                                <strong>Địa chỉ giao hàng của bạn:</strong>
                                                <div>{formik.values.shippingAddress}</div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                                    <div className="text-danger">{formik.errors.shippingAddress}</div>
                                )}
                            </div>

                            <TextAreaInput
                                rows={2}
                                maxLength={255}
                                showCount
                                id="note"
                                className="col-12"
                                label="Yêu cầu khác"
                                value={formik.values.note}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.note && formik.errors.note ? formik.errors.note : null}
                            />

                            <div className="col-12">
                                <Checkbox
                                    name="requestInvoice"
                                    checked={formik.values.requestInvoice}
                                    onChange={(e) => formik.setFieldValue('requestInvoice', e.target.checked)}
                                >
                                    Yêu cầu xuất hóa đơn công ty (Vui lòng điền email để nhận hóa đơn VAT)
                                </Checkbox>
                            </div>

                            {formik.values.requestInvoice && (
                                <>
                                    <TextInput
                                        className="col-12"
                                        label="Tên công ty"
                                        id="invoiceCompanyName"
                                        required
                                        value={formik.values.invoiceCompanyName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.invoiceCompanyName && formik.errors.invoiceCompanyName
                                                ? formik.errors.invoiceCompanyName
                                                : null
                                        }
                                    />

                                    <TextInput
                                        className="col-12"
                                        label="Địa chỉ công ty"
                                        id="invoiceCompanyAddress"
                                        required
                                        value={formik.values.invoiceCompanyAddress}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.invoiceCompanyAddress && formik.errors.invoiceCompanyAddress
                                                ? formik.errors.invoiceCompanyAddress
                                                : null
                                        }
                                    />

                                    <TextInput
                                        className="col-12"
                                        label="Mã số thuế"
                                        id="invoiceTaxCode"
                                        required
                                        value={formik.values.invoiceTaxCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.invoiceTaxCode && formik.errors.invoiceTaxCode
                                                ? formik.errors.invoiceTaxCode
                                                : null
                                        }
                                    />
                                </>
                            )}
                        </div>

                        <div className="row g-3 mt-4">
                            <div className="col-12">
                                <h4 className="mb-3">Chọn phương thức thanh toán</h4>

                                <Radio.Group
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                    }}
                                    name="paymentMethod"
                                    value={formik.values.paymentMethod}
                                    onChange={(e) => formik.setFieldValue('paymentMethod', e.target.value)}
                                    options={paymentMethodOptions}
                                />
                            </div>

                            <div className="col-12">
                                <Button
                                    block
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    loading={formik.isSubmitting}
                                >
                                    ĐẶT HÀNG
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Checkout;
