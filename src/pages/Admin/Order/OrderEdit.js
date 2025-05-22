import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, message, Space } from 'antd';

import { handleError } from '~/utils/errorHandler';
import { SelectInput, TextInput } from '~/components/FormInput';
import { updateOrder } from '~/services/ordersService';
import { REGEXP_FULL_NAME, REGEXP_PHONE_NUMBER } from '~/constants';

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
            is: 'HOME_DELIVERY',
            then: yup.string().required('Vui lòng nhập địa chỉ giao hàng'),
            otherwise: yup.string().nullable(),
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
                // const response = await getUserById(id);
                // const { email, phoneNumber, fullName, address, gender, role, ...additionalUserData } =
                //     response.data.data;
                // setUserData(additionalUserData);
                // formik.setValues({
                //     email,
                //     phoneNumber,
                //     fullName,
                //     address: address?.trim() === '' ? null : address,
                //     gender,
                //     roleId: role?.id || null,
                // });
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            }
        };

        fetchEntity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            {contextHolder}
            <h2>Chỉnh sửa đơn hàng</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <TextInput
                        id="username"
                        className="col-md-6"
                        label="Tên tài khoản"
                        autoComplete="off"
                        value={orderData.username}
                        disabled
                    />

                    <TextInput
                        id="email"
                        required
                        className="col-md-6"
                        label="Email"
                        placeholder="Nhập email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                    />

                    <TextInput
                        id="phoneNumber"
                        required
                        className="col-md-6"
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.phoneNumber && formik.errors.phoneNumber ? formik.errors.phoneNumber : null
                        }
                    />

                    <TextInput
                        id="fullName"
                        required
                        className="col-md-6"
                        label="Họ và tên"
                        placeholder="Nhập họ và tên"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : null}
                    />

                    <TextInput
                        id="address"
                        className="col-md-6"
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.address && formik.errors.address ? formik.errors.address : null}
                    />

                    <SelectInput
                        id="gender"
                        label="Giới tính"
                        placeholder="Chọn giới tính"
                        className="col-md-6"
                        options={genderOptions}
                        value={formik.values.gender}
                        onChange={(value) => formik.setFieldValue('gender', value)}
                        onBlur={() => formik.setFieldTouched('gender', true)}
                        error={formik.touched.gender && formik.errors.gender ? formik.errors.gender : null}
                    />

                    <div className="col-12 text-end">
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
