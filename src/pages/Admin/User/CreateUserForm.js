import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, message, Space } from 'antd';

import { handleError } from '~/utils/errorHandler';
import { SelectInput, TextInput } from '~/components/FormInput';
import { createUser } from '~/services/userService';
import { getRoles } from '~/services/roleService';
import { REGEXP_FULL_NAME, REGEXP_PASSWORD, REGEXP_PHONE_NUMBER, REGEXP_USERNAME } from '~/constants';

const entityListPage = '/admin/users';

const defaultValue = {
    username: '',
    password: '',
    repeatPassword: '',
    email: '',
    phoneNumber: '',
    fullName: '',
    address: null,
    gender: null,
    roleId: null,
};

const validationSchema = yup.object({
    username: yup
        .string()
        .trim()
        .required('Vui lòng nhập tên đăng nhập')
        .matches(REGEXP_USERNAME, 'Tên đăng nhập phải bắt đầu bằng chữ cái, chỉ chứa chữ thường và số, từ 4-16 ký tự'),

    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .matches(REGEXP_PASSWORD, 'Mật khẩu phải chứa ít nhất một chữ cái và một số, tối thiểu 6 ký tự'),

    repeatPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
        .required('Vui lòng nhập lại mật khẩu'),

    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),

    phoneNumber: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .matches(REGEXP_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),

    fullName: yup
        .string()
        .required('Vui lòng nhập họ và tên')
        .matches(REGEXP_FULL_NAME, 'Họ và tên phải có ít nhất hai từ'),

    address: yup.string().trim().min(5, 'Địa chỉ quá ngắn').max(255, 'Địa chỉ quá dài').nullable(),

    gender: yup.string().trim().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ').nullable(),

    roleId: yup.number().required('Vui lòng chọn quyền').typeError('Vui lòng chọn quyền'),
});

const genderOptions = [
    { label: 'Nam', value: 'MALE' },
    { label: 'Nữ', value: 'FEMALE' },
    { label: 'Khác', value: 'OTHER' },
];

function UserForm() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [roleList, setRoleList] = useState([]);
    const [isRoleLoading, setIsRoleLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await createUser(values);
            if (response.status === 201) {
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

    useEffect(() => {
        const fetchRoles = async () => {
            setIsRoleLoading(true);
            try {
                const response = await getRoles();
                setRoleList(response.data.data);
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            } finally {
                setIsRoleLoading(false);
            }
        };

        fetchRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {contextHolder}
            <h2>Thêm mới người dùng</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <TextInput
                        id="username"
                        required
                        className="col-md-6"
                        label="Tên tài khoản"
                        placeholder="Nhập tên tài khoản"
                        autoComplete="off"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && formik.errors.username ? formik.errors.username : null}
                    />

                    <SelectInput
                        id="roleId"
                        label="Quyền"
                        placeholder="Chọn quyền"
                        className="col-md-6"
                        loading={isRoleLoading}
                        fieldNames={{ label: 'name', value: 'id' }}
                        value={formik.values.roleId}
                        onChange={(value) => formik.setFieldValue('roleId', value)}
                        onBlur={() => formik.setFieldTouched('roleId', true)}
                        options={roleList}
                        error={formik.touched.roleId && formik.errors.roleId ? formik.errors.roleId : null}
                    />

                    <TextInput
                        id="password"
                        required
                        className="col-md-6"
                        type="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                    />

                    <TextInput
                        id="repeatPassword"
                        required
                        className="col-md-6"
                        type="password"
                        label="Nhập lại mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        value={formik.values.repeatPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.repeatPassword && formik.errors.repeatPassword
                                ? formik.errors.repeatPassword
                                : null
                        }
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

export default UserForm;
