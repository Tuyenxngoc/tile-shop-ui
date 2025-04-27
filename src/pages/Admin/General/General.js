import { Button, InputNumber, message } from 'antd';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';
import { INITIAL_FILTERS } from '~/constants';
import { handleError } from '~/utils/errorHandler';

const defaultValue = {
    pageSize: 10,
};

const validationSchema = yup.object({
    pageSize: yup
        .number()
        .min(1, 'Số dòng hiển thị phải lớn hơn 0.')
        .required('Số dòng hiển thị trên trang là bắt buộc.'),
});

function General() {
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = (values, { setSubmitting }) => {
        try {
            localStorage.setItem('configData', JSON.stringify(values));

            //Cập nhật lại pageSize
            INITIAL_FILTERS.pageSize = values.pageSize;

            messageApi.success('Cấu hình đã được lưu thành công!');
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
    });

    useEffect(() => {
        const fetchEntities = () => {
            try {
                const storedData = localStorage.getItem('configData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData.pageSize) {
                        formik.setFieldValue('pageSize', parsedData.pageSize);
                    }
                }
            } catch (error) {
                handleError(error, formik, messageApi);
            }
        };

        fetchEntities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {contextHolder}

            <h2>Cấu hình chung</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="pageSize">
                            <span className="text-danger">*</span> Số dòng hiển thị trên trang:
                        </label>
                    </div>
                    <div className="col-md-6">
                        <InputNumber
                            id="pageSize"
                            name="pageSize"
                            min={1}
                            value={formik.values.pageSize}
                            onChange={(value) => formik.setFieldValue('pageSize', value)}
                            onBlur={formik.handleBlur}
                            status={formik.touched.pageSize && formik.errors.pageSize ? 'error' : undefined}
                            style={{ width: '100%' }}
                        />
                        <div className="text-danger">{formik.touched.pageSize && formik.errors.pageSize}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-warning">(*):Không được phép để trống!</span>
                    </div>
                    <div className="col-md-6">
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default General;
