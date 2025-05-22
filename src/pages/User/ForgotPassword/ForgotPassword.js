import { Link } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { handleError } from '~/utils/errorHandler';
import { ROUTES } from '~/constants/routes';
import { forgotPassword } from '~/services/authService';

const validationSchema = yup.object({
    username: yup.string().trim().required('Vui lòng nhập tên đăng nhập'),

    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
});

const defaultValue = {
    username: '',
    email: '',
};

function ForgotPassword() {
    const [messageApi, contextHolder] = message.useMessage();

    const handleForgotPassword = async (values, { setSubmitting }) => {
        try {
            const response = await forgotPassword(values);
            if (response.status === 200) {
                messageApi.success('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.');
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
        onSubmit: handleForgotPassword,
    });

    return (
        <main className="py-5">
            {contextHolder}

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h2>Quên mật khẩu</h2>
                        <p>Vui lòng nhập thông tin của bạn để đặt lại mật khẩu.</p>

                        <form onSubmit={formik.handleSubmit}>
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
                                <Button
                                    style={{ width: '200px' }}
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    loading={formik.isSubmitting}
                                >
                                    Gửi yêu cầu
                                </Button>
                            </div>

                            <div>
                                Quay lại <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ForgotPassword;
