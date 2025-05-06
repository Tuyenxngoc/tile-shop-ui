import { useEffect, useState } from 'react';
import { Alert, Button, ColorPicker, Input, message, Spin } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { handleError } from '~/utils/errorHandler';
import { getStoreInfo, updateStoreInfo } from '~/services/storeService';
import useStore from '~/hooks/useStore';
import { REGEXP_COLOR } from '~/constants';

const { TextArea } = Input;

const defaultValue = {
    name: '',
    address: '',
    phone: '',
    phoneSupport: '',
    email: '',
    openingHours: '',
    facebookUrl: '',
    youtubeUrl: '',
    zaloUrl: '',
    bannerLink: '',
    backgroundColor: '',
    logo: null,
    logoSmall: null,
    bannerImage: null,
    backgroundImage: null,
};

const validationSchema = yup.object({
    name: yup.string().trim().max(255, 'Tối đa 255 ký tự.').required('Vui lòng nhập cửa hàng.'),

    address: yup.string().trim().max(255, 'Tối đa 255 ký tự.').required('Vui lòng nhập địa chỉ.'),

    phone: yup.string().trim().max(20, 'Tối đa 20 ký tự.').required('Vui lòng nhập số điện thoại.'),

    phoneSupport: yup.string().trim().max(20, 'Tối đa 20 ký tự.').nullable(),
    email: yup
        .string()
        .trim()
        .max(255, 'Tối đa 255 ký tự.')
        .email('Email không đúng định dạng.')
        .required('Vui lòng nhập email.'),

    openingHours: yup.string().trim().max(255, 'Tối đa 255 ký tự.').required('Vui lòng nhập giờ mở cửa.'),

    facebookUrl: yup.string().trim().max(255, 'Tối đa 255 ký tự.').required('Vui lòng nhập Facebook URL.'),

    youtubeUrl: yup.string().trim().max(255, 'Tối đa 255 ký tự.').required('Vui lòng nhập Youtube URL.'),

    zaloUrl: yup.string().trim().max(255, 'Tối đa 255 ký tự.').required('Vui lòng nhập Zalo URL.'),

    bannerLink: yup.string().trim().max(255, 'Tối đa 255 ký tự.').required('Vui lòng nhập link banner.'),

    backgroundColor: yup
        .string()
        .trim()
        .matches(REGEXP_COLOR, 'Mã màu không hợp lệ.')
        .required('Vui lòng nhập mã màu.'),
});

function StoreInfo() {
    const { setStoreInfo } = useStore();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const { logo, logoSmall, bannerImage, backgroundImage, ...updateValues } = values;
            const response = await updateStoreInfo(updateValues, logo, logoSmall, bannerImage, backgroundImage);
            if (response.status === 200) {
                const { message, data } = response.data.data;
                if (data) {
                    setStoreInfo(data);
                } else {
                    messageApi.success(message);
                }
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
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getStoreInfo();
                const { data } = response.data;
                if (data) {
                    formik.setValues(data);
                }
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center w-100">
                <Spin size="large" />
            </div>
        );
    }

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <>
            {contextHolder}

            <h2>Thiết lập thông tin cửa hàng</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="name">
                            <span className="text-danger">*</span> Tên cửa hàng:
                        </label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.name && formik.errors.name ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.name && formik.errors.name}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="address">
                            <span className="text-danger">*</span> Địa chỉ:
                        </label>
                    </div>
                    <div className="col-md-6">
                        <TextArea
                            rows={2}
                            id="address"
                            name="address"
                            autoComplete="off"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.address && formik.errors.address ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.address && formik.errors.address}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="phone">
                            <span className="text-danger">*</span> Số điện thoại:
                        </label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="phone"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.phone && formik.errors.phone ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.phone && formik.errors.phone}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="phoneSupport">Số điện thoại hỗ trợ:</label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="phoneSupport"
                            name="phoneSupport"
                            value={formik.values.phoneSupport}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.phoneSupport && formik.errors.phoneSupport ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.phoneSupport && formik.errors.phoneSupport}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-danger">*</span> <label htmlFor="email">Email:</label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="email"
                            name="email"
                            autoComplete="off"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.email && formik.errors.email ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.email && formik.errors.email}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-danger">*</span> <label htmlFor="openingHours">Giờ mở cửa:</label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="openingHours"
                            name="openingHours"
                            value={formik.values.openingHours}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.openingHours && formik.errors.openingHours ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.openingHours && formik.errors.openingHours}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-danger">*</span> <label htmlFor="facebookUrl">Đường dẫn Facebook:</label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="facebookUrl"
                            name="facebookUrl"
                            value={formik.values.facebookUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.facebookUrl && formik.errors.facebookUrl ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.facebookUrl && formik.errors.facebookUrl}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-danger">*</span> <label htmlFor="youtubeUrl">Đường dẫn Youtubte:</label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="youtubeUrl"
                            name="youtubeUrl"
                            value={formik.values.youtubeUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.youtubeUrl && formik.errors.youtubeUrl ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.youtubeUrl && formik.errors.youtubeUrl}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-danger">*</span> <label htmlFor="zaloUrl">Đường dẫn Zalo:</label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="zaloUrl"
                            name="zaloUrl"
                            value={formik.values.zaloUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.zaloUrl && formik.errors.zaloUrl ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.zaloUrl && formik.errors.zaloUrl}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="logo">Logo:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            type="file"
                            accept="image/*"
                            id="logo"
                            name="logo"
                            onChange={(event) => {
                                formik.setFieldValue('logo', event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="logoSmall">Logo nhỏ:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            type="file"
                            accept="image/*"
                            id="logoSmall"
                            name="logoSmall"
                            onChange={(event) => {
                                formik.setFieldValue('logoSmall', event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="backgroundImage">Ảnh nền:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            type="file"
                            accept="image/*"
                            id="backgroundImage"
                            name="backgroundImage"
                            onChange={(event) => {
                                formik.setFieldValue('backgroundImage', event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="bannerImage">Banner:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            type="file"
                            accept="image/*"
                            id="bannerImage"
                            name="bannerImage"
                            onChange={(event) => {
                                formik.setFieldValue('bannerImage', event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-danger">*</span> <label htmlFor="bannerLink">Đường dẫn (Banner):</label>
                    </div>
                    <div className="col-md-6">
                        <Input
                            id="bannerLink"
                            name="bannerLink"
                            value={formik.values.bannerLink}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.bannerLink && formik.errors.bannerLink ? 'error' : undefined}
                        />
                        <div className="text-danger">{formik.touched.bannerLink && formik.errors.bannerLink}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="backgroundColor">
                            <span className="text-danger">*</span> Màu nền trang chủ:
                        </label>
                    </div>
                    <div className="col-md-6 d-flex align-items-center gap-2">
                        <ColorPicker
                            value={formik.values.backgroundColor}
                            onChange={(color) => {
                                formik.setFieldValue('backgroundColor', color.toHexString());
                            }}
                        />
                        <Input
                            id="backgroundColor"
                            name="backgroundColor"
                            value={formik.values.backgroundColor}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={
                                formik.touched.backgroundColor && formik.errors.backgroundColor ? 'error' : undefined
                            }
                        />
                    </div>
                    <div className="col-md-6 offset-md-3">
                        <div className="text-danger">
                            {formik.touched.backgroundColor && formik.errors.backgroundColor}
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <span className="text-warning">(*):Không được phép để trống!</span>
                    </div>
                    <div className="col-md-6">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Lưu
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default StoreInfo;
