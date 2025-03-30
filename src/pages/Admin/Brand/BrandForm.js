import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Image, message, Space, Upload } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { MdOutlineFileUpload } from 'react-icons/md';

import images from '~/assets';
import { checkIdIsNumber } from '~/utils/helper';
import { handleError } from '~/utils/errorHandler';
import { TextInput, TextAreaInput } from '~/components/FormInput';
import { createBrand, getBrandById, updateBrand } from '~/services/brandService';

const entityListPage = '/admin/brands';

const defaultValue = {
    name: '',
    description: '',
};

const validationSchema = yup.object({
    name: yup.string().required('Tên thương hiệu là bắt buộc'),
});

function BrandForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleUploadChange = ({ file }) => {
        const { originFileObj } = file;
        if (!originFileObj) {
            return;
        }

        const url = URL.createObjectURL(originFileObj);
        setPreviewImage(url);
        setUploadedImage(originFileObj);
    };

    const handleBeforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            messageApi.error('Bạn chỉ có thể upload file hình ảnh!');
        }
        return isImage;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;
            if (id) {
                response = await updateBrand(id, values, uploadedImage);
            } else {
                if (!uploadedImage) {
                    messageApi.warning('Vui lòng chọn một ảnh logo');
                    return;
                }
                response = await createBrand(values, uploadedImage);
            }

            if (response.status === 200 || response.status === 201) {
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

        if (!checkIdIsNumber(id)) {
            navigate(entityListPage);
            return;
        }

        const fetchEntity = async () => {
            try {
                const response = await getBrandById(id);
                const { name, description, logoUrl } = response.data.data;

                setPreviewImage(logoUrl);
                formik.setValues({
                    name,
                    description,
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
            <h2>{id ? 'Chỉnh sửa thương hiệu' : 'Thêm mới thương hiệu'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-8 col-12">
                        <div className="row g-3">
                            <TextInput
                                required
                                id="name"
                                className="col-12"
                                label="Tên thương hiệu"
                                placeholder="Nhập tên thương hiệu"
                                helperText="Tên thương hiệu từ 3-100 kí tự"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                            />

                            <TextAreaInput
                                id="description"
                                className="col-12"
                                label="Mô tả"
                                placeholder="Nhập mô tả"
                                helperText="Mô tả từ 3-1500 kí tự"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.description && formik.errors.description
                                        ? formik.errors.description
                                        : null
                                }
                            />
                        </div>
                    </div>

                    <div className="col-md-4 col-12">
                        <span>
                            <span className="text-danger">*</span> Logo thương hiệu:
                        </span>
                        <div className="text-center">
                            <Image className="w-100" src={previewImage} fallback={images.placeimgHorizontal} />

                            <Upload
                                className="d-block mt-2"
                                accept="image/*"
                                maxCount={1}
                                showUploadList={false}
                                beforeUpload={handleBeforeUpload}
                                onChange={handleUploadChange}
                                customRequest={() => false}
                            >
                                <Button icon={<MdOutlineFileUpload />}>Chọn ảnh để tải lên</Button>
                            </Upload>
                        </div>
                    </div>

                    <div className="col-md-12 text-end">
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

export default BrandForm;
