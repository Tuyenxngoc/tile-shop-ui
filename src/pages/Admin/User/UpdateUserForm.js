import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, message, Space } from 'antd';

import { handleError } from '~/utils/errorHandler';
import { SelectInput, TextInput } from '~/components/FormInput';
import { getUserById, updateUser } from '~/services/userService';
import { getRoles } from '~/services/roleService';

const entityListPage = '/admin/users';

const defaultValue = {
    email: '',
    phoneNumber: '',
    fullName: '',
    address: '',
    gender: null,
    roleId: null,
};

const genderOptions = [
    { label: 'Nam', value: 'MALE' },
    { label: 'Nữ', value: 'FEMALE' },
    { label: 'Khác', value: 'OTHER' },
];

const validationSchema = yup.object({
    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),

    phoneNumber: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/, 'Số điện thoại không hợp lệ'),

    fullName: yup
        .string()
        .required('Vui lòng nhập họ và tên')
        .matches(/^\S+(\s+\S+)+$/, 'Họ và tên phải có ít nhất hai từ'),

    address: yup.string().trim().min(5, 'Địa chỉ quá ngắn').max(255, 'Địa chỉ quá dài').nullable(),

    gender: yup.string().trim().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ').nullable(),

    roleId: yup.number().required('Vui lòng chọn quyền').typeError('Vui lòng chọn quyền'),
});

function UpdateUserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [userData, setUserData] = useState({});

    const [roleList, setRoleList] = useState([]);
    const [isRoleLoading, setIsRoleLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updateUser(id, values);
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

    //Tải dữ liệu
    useEffect(() => {
        if (!id) return;

        const fetchEntity = async () => {
            try {
                const response = await getUserById(id);
                const { email, phoneNumber, fullName, address, gender, role, ...additionalUserData } =
                    response.data.data;
                setUserData(additionalUserData);
                formik.setValues({
                    email,
                    phoneNumber,
                    fullName,
                    address: address?.trim() === '' ? null : address,
                    gender,
                    roleId: role?.id || null,
                });
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
            <h2>{id ? 'Chỉnh sửa người dùng' : 'Thêm mới người dùng'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <TextInput
                        id="username"
                        className="col-md-6"
                        label="Tên tài khoản"
                        autoComplete="off"
                        value={userData.username}
                        disabled
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

export default UpdateUserForm;
