import { useEffect, useState } from 'react';
import { Alert, Button, Checkbox, Radio, Spin } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { getCartItems } from '~/services/cartService';
import OrderItem from '~/components/OrderItem';
import ProvinceSelector from '~/components/ProvinceSelector';
import { TextAreaInput, TextInput } from '~/components/FormInput';
import { formatCurrency } from '~/utils';
import useAuth from '~/hooks/useAuth';
import useStore from '~/hooks/useStore';
import { initiateVnpayPayment } from '~/services/paymentService';
import queryString from 'query-string';
import { createOrder } from '~/services/ordersService';

const deliveryMethodOptions = [
    { value: 'home_delivery', label: 'Giao hàng tận nơi' },
    { value: 'store_pickup', label: 'Nhận tại cửa hàng' },
];

const paymentMethodOptions = [
    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
    { value: 'vnpay', label: 'Thanh toán qua VNPAY' },
];

const genderOptions = [
    { value: 'MALE', label: 'Anh' },
    { value: 'FEMALE', label: 'Chị' },
    { value: 'OTHER', label: 'Khác' },
];

const defaultValue = {
    gender: genderOptions[0].value,
    fullName: '',
    phoneNumber: '',
    email: '',
    deliveryMethod: deliveryMethodOptions[0].value,
    shippingAddress: '',
    note: '',
    needInvoice: false,
    invoiceCompanyName: '',
    invoiceTaxCode: '',
    invoiceCompanyAddress: '',
    paymentMethod: paymentMethodOptions[0].value,
};

const validationSchema = yup.object({
    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),

    phoneNumber: yup
        .string()
        .trim()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/, 'Số điện thoại không hợp lệ'),

    fullName: yup
        .string()
        .trim()
        .required('Vui lòng nhập họ và tên')
        .matches(/^\S+(\s+\S+)+$/, 'Họ và tên phải có ít nhất hai từ'),

    deliveryMethod: yup.string().required('Vui lòng chọn phương thức giao hàng'),

    shippingAddress: yup.string().when('deliveryMethod', {
        is: (val) => val === 'home_delivery',
        then: () => yup.string().required('Vui lòng chọn địa chỉ giao hàng'),
        otherwise: () => yup.string().notRequired(),
    }),

    needInvoice: yup.boolean(),

    invoiceCompanyName: yup.string().when('needInvoice', {
        is: true,
        then: () => yup.string().required('Vui lòng nhập tên công ty'),
        otherwise: () => yup.string().notRequired(),
    }),

    invoiceTaxCode: yup.string().when('needInvoice', {
        is: true,
        then: () => yup.string().required('Vui lòng nhập mã số thuế'),
        otherwise: () => yup.string().notRequired(),
    }),

    invoiceCompanyAddress: yup.string().when('needInvoice', {
        is: true,
        then: () => yup.string().required('Vui lòng nhập địa chỉ công ty'),
        otherwise: () => yup.string().notRequired(),
    }),
});

function Checkout() {
    const { user } = useAuth();
    const store = useStore();

    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);

        if (values.paymentMethod === 'vnpay') {
            // Initiate VNPAY payment
            try {
                const params = queryString.stringify({ amount: totalPrice });
                const response = await initiateVnpayPayment(params);
                const { url } = response.data.data;

                // Redirect user to the VNPAY payment page
                window.location.href = url;
            } catch (error) {
                setErrorMessage(error.response?.data?.message || 'Lỗi thanh toán qua VNPAY. Vui lòng thử lại sau.');
            }
        } else {
            // Handle other payment methods (e.g., COD)
            // Process COD or other methods
            try {
                const response = await createOrder(values);
            } catch (error) {}
        }
    };

    const formik = useFormik({
        initialValues: {
            ...defaultValue,
            fullName: user.fullName || user.username || '',
            phoneNumber: user.phoneNumber || '',
            email: user.email || '',
            address: user.address || '',
            gender: user.gender || genderOptions[0].value,
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getCartItems();
                const { data } = response.data;
                setEntityData(data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, []);

    useEffect(() => {
        if (entityData && entityData.length > 0) {
            const totalPrice = entityData.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);

            setTotalPrice(totalPrice);
        } else {
            setTotalPrice(0);
        }
    }, [entityData]);

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
        <div className="container mt-5 mb-5">
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-md-4 order-md-2 mb-4">
                        <h4 className="mb-3">Giỏ hàng của bạn</h4>
                        {entityData.map((item, index) => (
                            <OrderItem key={index} data={item} />
                        ))}

                        <div>
                            Tổng tiền: <span className="">{formatCurrency(totalPrice)}</span>
                        </div>
                    </div>

                    <div className="col-md-8 order-md-1">
                        <div className="row g-3">
                            <div className="col-12">
                                <h4 className="mb-3">Thông tin khách hàng</h4>
                            </div>

                            <Radio.Group
                                name="gender"
                                value={formik.values.gender}
                                onChange={(e) => formik.setFieldValue('gender', e.target.value)}
                                options={genderOptions}
                            />

                            <TextInput
                                className="col-12"
                                size="large"
                                label="Nhập họ tên"
                                id="fullName"
                                required
                                autoComplete="off"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : null
                                }
                            />

                            <TextInput
                                className="col-12"
                                size="large"
                                label="Nhập số điện thoại"
                                id="phoneNumber"
                                required
                                autoComplete="off"
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
                                className="col-12"
                                size="large"
                                id="email"
                                required
                                label="Email"
                                placeholder="Nhập email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                            />

                            <div className="col-12">
                                <h4 className="mb-3">Chọn cách thức giao hàng</h4>

                                <Radio.Group
                                    name="deliveryMethod"
                                    value={formik.values.deliveryMethod}
                                    onChange={(e) => formik.setFieldValue('deliveryMethod', e.target.value)}
                                    options={deliveryMethodOptions}
                                />

                                {formik.values.deliveryMethod === 'store_pickup' && (
                                    <div className="mt-2">
                                        <strong>Địa chỉ nhận hàng tại cửa hàng:</strong>
                                        <div>{store.address}</div>
                                    </div>
                                )}

                                {formik.values.deliveryMethod === 'home_delivery' && (
                                    <ProvinceSelector
                                        onChange={({ fullAddress }) =>
                                            formik.setFieldValue('shippingAddress', fullAddress)
                                        }
                                    />
                                )}

                                {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                                    <div className="text-danger">{formik.errors.shippingAddress}</div>
                                )}
                            </div>

                            <TextAreaInput
                                rows={2}
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
                                    checked={formik.values.needInvoice}
                                    onChange={(e) => formik.setFieldValue('needInvoice', e.target.checked)}
                                >
                                    Yêu cầu xuất hóa đơn công ty (Vui lòng điền email để nhận hóa đơn VAT)
                                </Checkbox>
                            </div>

                            {formik.values.needInvoice && (
                                <>
                                    <TextInput
                                        className="col-12"
                                        size="large"
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
                                        size="large"
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
                                        size="large"
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
                                    size="large"
                                    options={paymentMethodOptions}
                                />
                            </div>

                            <div className="col-12">
                                <Button block type="primary" htmlType="submit" size="large">
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
