import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, message, Space, Table } from 'antd';

import { formatCurrency, formatDate } from '~/utils';
import { handleError } from '~/utils/errorHandler';
import { SelectInput, TextInput } from '~/components/FormInput';
import { getOrderById, updateOrder } from '~/services/ordersService';
import { REGEXP_FULL_NAME, REGEXP_PHONE_NUMBER } from '~/constants';
import { orderStatusTags, paymentMethodLabelMap } from '~/constants/order';

const entityListPage = '/admin/orders';

const defaultValue = {
    deliveryMethod: null,
    recipientName: '',
    recipientGender: '',
    recipientEmail: '',
    recipientPhone: '',
    shippingAddress: '',
    note: '',
    cancelReason: '',
};

const genderOptions = [
    { label: 'Nam', value: 'MALE' },
    { label: 'Nữ', value: 'FEMALE' },
    { label: 'Khác', value: 'OTHER' },
];

const deliveryMethodOptions = [
    { value: 'HOME_DELIVERY', label: 'Giao hàng tận nơi' },
    { value: 'STORE_PICKUP', label: 'Nhận tại cửa hàng' },
];

const validationSchema = yup.object({
    deliveryMethod: yup.string().required('Vui lòng chọn phương thức giao hàng'),

    recipientName: yup
        .string()
        .required('Vui lòng nhập họ và tên')
        .matches(REGEXP_FULL_NAME, 'Họ và tên phải có ít nhất hai từ')
        .min(2, 'Họ và tên phải từ 2 ký tự trở lên')
        .max(100, 'Họ và tên không được vượt quá 100 ký tự'),

    recipientGender: yup.string().nullable().oneOf(['MALE', 'FEMALE', 'OTHER', null], 'Giới tính không hợp lệ'),

    recipientEmail: yup
        .string()
        .email('Email không hợp lệ')
        .max(100, 'Email không được vượt quá 100 ký tự')
        .nullable()
        .notRequired(),

    recipientPhone: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .matches(REGEXP_PHONE_NUMBER, 'Số điện thoại không hợp lệ')
        .min(10, 'Số điện thoại phải ít nhất 10 ký tự')
        .max(20, 'Số điện thoại không được vượt quá 20 ký tự'),

    shippingAddress: yup
        .string()
        .max(255, 'Địa chỉ không được vượt quá 255 ký tự')
        .when('deliveryMethod', {
            is: (val) => val === 'HOME_DELIVERY',
            then: () => yup.string().trim().required('Vui lòng chọn địa chỉ giao hàng'),
            otherwise: () => yup.string().nullable(),
        }),

    note: yup.string().max(512, 'Ghi chú không được vượt quá 512 ký tự').nullable(),

    cancelReason: yup.string().max(512, 'Lý do hủy không được vượt quá 512 ký tự').nullable(),
});

function OrderEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [orderData, setOrderData] = useState({});

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updateOrder(id, values);
            if (response.status === 200) {
                navigate(entityListPage);
            }
        } catch (error) {
            handleError(error, formik, messageApi);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    //Tải dữ liệu
    useEffect(() => {
        if (!id) return;

        const fetchEntity = async () => {
            try {
                const response = await getOrderById(id);
                const {
                    deliveryMethod,
                    recipientName,
                    recipientGender,
                    recipientEmail,
                    recipientPhone,
                    shippingAddress,
                    note,
                    cancelReason,
                    ...additionalUserData
                } = response.data.data;
                setOrderData(additionalUserData);
                formik.setValues({
                    deliveryMethod,
                    recipientName,
                    recipientGender,
                    recipientEmail,
                    recipientPhone,
                    shippingAddress,
                    note,
                    cancelReason,
                });
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            }
        };

        fetchEntity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const productColumns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: ['product', 'name'],
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={record.product.imageUrl}
                        alt={record.product.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 8 }}
                    />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'Giá tại thời điểm đặt',
            dataIndex: 'priceAtTimeOfOrder',
            key: 'priceAtTimeOfOrder',
            render: (price) => `${price.toLocaleString()}₫`,
            align: 'right',
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (record) => `${(record.quantity * record.priceAtTimeOfOrder).toLocaleString()}₫`,
            align: 'right',
        },
    ];

    return (
        <>
            {contextHolder}

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    {/* Thông tin khách hàng */}
                    <div className="col-12">
                        <h4>Thông tin khách hàng</h4>
                        <hr />
                    </div>

                    <div className="col-md-6">
                        <span>Tên tài khoản đặt hàng</span>
                        <p>{orderData.user?.username || ''}</p>
                    </div>

                    <div className="col-md-6">
                        <span>Email tài khoản đặt hàng</span>
                        <p>{orderData.user?.email || ''}</p>
                    </div>

                    <TextInput
                        id="recipientName"
                        className="col-md-6"
                        label="Họ và tên nguời nhận"
                        placeholder="Nhập họ và tên nguời nhận"
                        value={formik.values.recipientName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.recipientName && formik.errors.recipientName
                                ? formik.errors.recipientName
                                : null
                        }
                    />

                    <SelectInput
                        id="recipientGender"
                        label="Giới tính"
                        placeholder="Chọn giới tính"
                        className="col-md-6"
                        options={genderOptions}
                        value={formik.values.recipientGender}
                        onChange={(value) => formik.setFieldValue('recipientGender', value)}
                        onBlur={() => formik.setFieldTouched('recipientGender', true)}
                        error={
                            formik.touched.recipientGender && formik.errors.recipientGender
                                ? formik.errors.recipientGender
                                : null
                        }
                    />

                    <TextInput
                        id="recipientEmail"
                        className="col-md-6"
                        label="Email nguời nhận"
                        placeholder="Nhập email nguời nhận"
                        value={formik.values.recipientEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.recipientEmail && formik.errors.recipientEmail
                                ? formik.errors.recipientEmail
                                : null
                        }
                    />

                    <TextInput
                        id="recipientPhone"
                        className="col-md-6"
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        value={formik.values.recipientPhone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.recipientPhone && formik.errors.recipientPhone
                                ? formik.errors.recipientPhone
                                : null
                        }
                    />

                    {/* Thông tin đơn hàng */}
                    <div className="col-12 mt-4">
                        <h4>Thông tin đơn hàng</h4>
                        <hr />
                    </div>

                    <div className="col-md-6">
                        <span>Mã đơn hàng</span>
                        <p>{orderData.id}</p>
                    </div>

                    <div className="col-md-6">
                        <span>Tổng tiền</span>
                        <p>{formatCurrency(orderData.totalAmount)}</p>
                    </div>

                    <div className="col-md-6">
                        <span>Trạng thái</span>
                        <p>{orderStatusTags[orderData.status]}</p>
                    </div>

                    <div className="col-md-6">
                        <span>Phương thức thanh toán</span>
                        <p>{paymentMethodLabelMap[orderData.paymentMethod]}</p>
                    </div>

                    <div className="col-md-6">
                        <span>Ngày đặt:</span>
                        <p>{formatDate(orderData.createdDate)}</p>
                    </div>

                    <div className="col-md-6">
                        <span>Ngày cập nhật</span>
                        <p>{formatDate(orderData.lastModifiedDate)}</p>
                    </div>

                    <SelectInput
                        id="deliveryMethod"
                        label="Phương thức giao hàng"
                        placeholder="Chọn phương thức"
                        className="col-md-6"
                        options={deliveryMethodOptions}
                        value={formik.values.deliveryMethod}
                        onChange={(value) => formik.setFieldValue('deliveryMethod', value)}
                        onBlur={() => formik.setFieldTouched('deliveryMethod', true)}
                        error={
                            formik.touched.deliveryMethod && formik.errors.deliveryMethod
                                ? formik.errors.deliveryMethod
                                : null
                        }
                    />

                    <TextInput
                        id="shippingAddress"
                        className="col-md-6"
                        label="Địa chỉ giao hàng"
                        placeholder="Nhập địa chỉ"
                        value={formik.values.shippingAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.shippingAddress && formik.errors.shippingAddress
                                ? formik.errors.shippingAddress
                                : null
                        }
                    />

                    <TextInput
                        id="note"
                        className="col-12"
                        label="Ghi chú"
                        placeholder="Nhập ghi chú (nếu có)"
                        value={formik.values.note}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.note && formik.errors.note ? formik.errors.note : null}
                    />

                    <TextInput
                        id="cancelReason"
                        className="col-12"
                        label="Lý do hủy"
                        placeholder="Nhập lý do hủy (nếu có)"
                        value={formik.values.cancelReason}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.cancelReason && formik.errors.cancelReason
                                ? formik.errors.cancelReason
                                : null
                        }
                    />

                    {/* Thông tin sản phẩm */}
                    <div className="col-12 mt-4">
                        <h4>Thông tin sản phẩm</h4>
                        <hr />

                        <Table
                            dataSource={orderData.orderItems}
                            columns={productColumns}
                            pagination={false}
                            rowKey="id"
                        />
                    </div>

                    {/* Nút thao tác */}
                    <div className="col-12 text-end mt-4">
                        <Space>
                            <Button onClick={() => navigate(entityListPage)}>Quay lại</Button>
                            <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                                Lưu
                            </Button>
                        </Space>
                    </div>
                </div>
            </form>
        </>
    );
}

export default OrderEdit;
