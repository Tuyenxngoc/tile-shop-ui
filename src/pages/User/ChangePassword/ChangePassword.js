import { Button, Input, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { handleError } from '~/utils/errorHandler';
import { changePassword } from '~/services/authService';

const defaultValue = {
    oldPassword: '',
    password: '',
    repeatPassword: '',
};

const validationSchema = yup.object({
    oldPassword: yup.string().required('Vui lòng nhập mật khẩu cũ'),

    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
            'Mật khẩu phải chứa ít nhất một chữ cái và một số, tối thiểu 6 ký tự',
        ),

    repeatPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
        .required('Vui lòng nhập lại mật khẩu'),
});

function ChangePassword() {
    const [messageApi, contextHolder] = message.useMessage();

    const handleChangePassword = async (values, { setSubmitting }) => {
        try {
            const response = await changePassword(values);
            if (response.status === 200) {
                messageApi.success('Đổi mật khẩu thành công.');
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
        onSubmit: handleChangePassword,
    });

    return (
        <div className="row justify-content-center">
            {contextHolder}

            <div className="col-6">
                <h3>Đổi mật khẩu</h3>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="oldPassword">Mật khẩu cũ:</label>
                        <Input.Password
                            id="oldPassword"
                            name="oldPassword"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.oldPassword && formik.errors.oldPassword ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.oldPassword && formik.errors.oldPassword}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password">Mật khẩu mới:</label>
                        <Input.Password
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
                        <label htmlFor="repeatPassword">Xác nhận mật khẩu mới:</label>
                        <Input.Password
                            id="repeatPassword"
                            name="repeatPassword"
                            value={formik.values.repeatPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.repeatPassword && formik.errors.repeatPassword ? 'error' : undefined}
                        />
                        <div className="text-danger">
                            {formik.touched.repeatPassword && formik.errors.repeatPassword}
                        </div>
                    </div>

                    <div className="mb-3">
                        <Button
                            style={{ width: '200px' }}
                            type="primary"
                            htmlType="submit"
                            loading={formik.isSubmitting}
                        >
                            Đổi mật khẩu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
