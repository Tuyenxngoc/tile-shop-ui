import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import useAuth from '~/hooks/useAuth';
import { handleError } from '~/utils/errorHandler';
import { loginAPI } from '~/services/authService';
import { ROUTES } from '~/constants/routes';

const validationSchema = yup.object({
    username: yup.string().trim().required('Vui lòng nhập tên đăng nhập'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
});

const defaultValue = {
    username: '',
    password: '',
};

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, login } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (values, { setSubmitting }) => {
        try {
            const response = await loginAPI(values);
            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data.data;
                login({ accessToken, refreshToken });
                navigate(from, { replace: true });
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
        onSubmit: handleLogin,
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <main className="py-5">
            {contextHolder}

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h2>Đăng nhập</h2>
                        <p>Xin chào, vui lòng nhập nội dung sau để tiếp tục.</p>

                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username">Tên tài khoản:</label>
                                <Input
                                    size="large"
                                    id="username"
                                    name="username"
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
                                <Button
                                    style={{ width: '170px' }}
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    loading={formik.isSubmitting}
                                >
                                    Đăng nhập
                                </Button>
                                <Link className="mx-2" to={ROUTES.FORGOT_PASSWORD}>
                                    Quên mật khẩu ?
                                </Link>
                            </div>

                            <div>
                                Bạn chưa có tài khoản? <Link to={ROUTES.REGISTER}>Đăng ký ngay</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;
