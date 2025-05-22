import { Link } from 'react-router-dom';

import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { handleError } from '~/utils/errorHandler';
import { registerAPI } from '~/services/authService';
import { ROUTES } from '~/constants/routes';
import { REGEXP_FULL_NAME, REGEXP_PASSWORD, REGEXP_PHONE_NUMBER, REGEXP_USERNAME } from '~/constants';

const validationSchema = yup.object({
    fullName: yup
        .string()
        .trim()
        .required('Vui lòng nhập họ và tên')
        .matches(REGEXP_FULL_NAME, 'Họ và tên phải có ít nhất hai từ'),

    phoneNumber: yup
        .string()
        .trim()
        .required('Vui lòng nhập số điện thoại')
        .matches(REGEXP_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),

    username: yup
        .string()
        .trim()
        .required('Vui lòng nhập tên đăng nhập')
        .matches(REGEXP_USERNAME, 'Tên đăng nhập phải bắt đầu bằng chữ cái, chỉ chứa chữ thường và số, từ 4-16 ký tự'),

    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),

    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .matches(REGEXP_PASSWORD, 'Mật khẩu phải chứa ít nhất một chữ cái và một số, tối thiểu 6 ký tự'),

    repeatPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
        .required('Vui lòng nhập lại mật khẩu'),
});

const defaultValue = {
    fullName: '',
    phoneNumber: '',
    username: '',
    password: '',
    repeatPassword: '',
    email: '',
};

function Register() {
    const [messageApi, contextHolder] = message.useMessage();

    const handleRegister = async (values, { setSubmitting }) => {
        try {
            const response = await registerAPI(values);
            if (response.status === 201) {
                messageApi.success('Đăng ký thành công! Vui lòng đăng nhập.');
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
        onSubmit: handleRegister,
    });

    return (
        <main className="py-5">
            {contextHolder}

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h2>Đăng ký</h2>
                        <p>Vui lòng nhập thông tin của bạn để tạo tài khoản.</p>

                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="fullName">Họ và tên:</label>
                                <Input
                                    size="large"
                                    id="fullName"
                                    name="fullName"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    status={formik.touched.fullName && formik.errors.fullName ? 'error' : undefined}
                                />
                                <div className="text-danger">{formik.touched.fullName && formik.errors.fullName}</div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phoneNumber">Số điện thoại:</label>
                                <Input
                                    size="large"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    status={
                                        formik.touched.phoneNumber && formik.errors.phoneNumber ? 'error' : undefined
                                    }
                                />
                                <div className="text-danger">
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email">Email:</label>
                                <Input
                                    size="large"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    status={formik.touched.email && formik.errors.email ? 'error' : undefined}
                                />
                                <div className="text-danger">{formik.touched.email && formik.errors.email}</div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="username">Tên tài khoản:</label>
                                <Input
                                    size="large"
                                    id="username"
                                    name="username"
                                    autoComplete="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    status={formik.touched.username && formik.errors.username ? 'error' : undefined}
                                />
                                <div className="text-danger">{formik.touched.username && formik.errors.username}</div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password">Mật khẩu:</label>
                                <Input.Password
                                    size="large"
                                    id="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    status={formik.touched.password && formik.errors.password ? 'error' : undefined}
                                />
                                <div className="text-danger">{formik.touched.password && formik.errors.password}</div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="repeatPassword">Nhập lại mật khẩu:</label>
                                <Input.Password
                                    size="large"
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    value={formik.values.repeatPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    status={
                                        formik.touched.repeatPassword && formik.errors.repeatPassword
                                            ? 'error'
                                            : undefined
                                    }
                                />
                                <div className="text-danger">
                                    {formik.touched.repeatPassword && formik.errors.repeatPassword}
                                </div>
                            </div>

                            <div className="mb-3">
                                <Button
                                    style={{ width: '170px' }}
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    loading={formik.isSubmitting}
                                >
                                    Đăng ký
                                </Button>
                            </div>

                            <div>
                                Bạn đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập ngay</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Register;
