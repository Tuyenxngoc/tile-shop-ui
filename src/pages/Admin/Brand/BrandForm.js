import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ImgCrop from 'antd-img-crop';
import { ArrowDownOutlined, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, message, Space, Upload } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';
import slugify from 'slugify';

import { checkIdIsNumber } from '~/utils/helper';
import { getBase64, validateFile } from '~/utils';
import { handleError } from '~/utils/errorHandler';
import { TextInput, RichTextInput } from '~/components/FormInput';
import { createBrand, getBrandById, updateBrand } from '~/services/brandService';

const entityListPage = '/admin/brands';
const maxImageCount = 1;

const defaultValue = {
    name: '',
    slug: '',
    description: '',
};

const validationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required('Tên thương hiệu là bắt buộc')
        .max(255, 'Tên thương hiệu không được vượt quá 255 ký tự'),

    slug: yup.string().trim().required('Đường dẫn là bắt buộc').max(255, 'Đường dẫn không được vượt quá 255 ký tự'),
});

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Thêm hình ảnh</div>
    </button>
);

function BrandForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            try {
                file.preview = await getBase64(file.originFileObj);
            } catch (error) {
                messageApi.error('Không thể xem trước ảnh!');
                return;
            }
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleFileListChange = ({ file, fileList: newFileList }) => {
        if (!file.originFileObj) {
            setFileList(newFileList);
            return;
        }

        const response = validateFile(file);
        if (!response.result) {
            return;
        }

        setFileList(newFileList);
    };

    const handleBeforeCrop = (file) => {
        const response = validateFile(file);
        if (!response.result) {
            messageApi.error(response.message);
            return false;
        }

        return true;
    };

    const handleCustomRequest = (options) => {
        const { onSuccess } = options;
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;
            const image = fileList?.[0];

            if (id) {
                response = await updateBrand(id, values, image);
            } else {
                response = await createBrand(values, image);
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

    useEffect(() => {
        if (formik.values.name) {
            const generatedSlug = slugify(formik.values.name, { lower: true, strict: true });
            formik.setFieldValue('slug', generatedSlug);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.name]);

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
                const { name, slug, description, logoUrl } = response.data.data;

                formik.setValues({
                    name,
                    slug,
                    description,
                });

                if (logoUrl) {
                    const mappedImages = [
                        {
                            uid: '1',
                            name: 'image-1.jpg',
                            status: 'done',
                            url: logoUrl,
                        },
                    ];
                    setFileList(mappedImages);
                }
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
                    <div className="col-12">
                        <span>Logo thương hiệu:</span>
                        <div className="text-center">
                            <ImgCrop
                                rotationSlider
                                aspectSlider
                                showReset
                                aspect={240 / 84}
                                resetText="Đặt lại"
                                modalTitle="Chỉnh sửa hình ảnh"
                                beforeCrop={handleBeforeCrop}
                            >
                                <Upload
                                    accept="image/*"
                                    listType="picture-card"
                                    fileList={fileList}
                                    maxCount={maxImageCount}
                                    onPreview={handlePreview}
                                    onChange={handleFileListChange}
                                    customRequest={handleCustomRequest}
                                >
                                    {fileList.length >= maxImageCount ? null : uploadButton}
                                </Upload>
                            </ImgCrop>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </div>
                    </div>

                    <TextInput
                        required
                        maxLength={255}
                        showCount
                        id="name"
                        className="col-12 col-md-5"
                        label="Tên thương hiệu"
                        placeholder="Nhập tên thương hiệu"
                        helperText="Tên thương hiệu tối đa 255 kí tự"
                        autoComplete="off"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                    />

                    {/* Mũi tên ngang: chỉ hiện khi md trở lên */}
                    <div className="col-12 col-md-2 d-none d-md-flex justify-content-center align-items-center">
                        <ArrowRightOutlined size={24} />
                    </div>

                    {/* Mũi tên xuống: chỉ hiện khi nhỏ hơn md */}
                    <div className="col-12 d-flex d-md-none justify-content-center align-items-center my-2">
                        <ArrowDownOutlined size={24} />
                    </div>

                    <TextInput
                        required
                        id="slug"
                        className="col-12 col-md-5"
                        label="Đường dẫn thương hiệu"
                        placeholder="Ví dụ: ao-thun-nam-tron"
                        helperText="Chuỗi không dấu, cách nhau bằng dấu gạch ngang (-), tối đa 255 ký tự."
                        value={formik.values.slug}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.slug && formik.errors.slug ? formik.errors.slug : null}
                    />

                    <RichTextInput
                        id="description"
                        className="col-12"
                        label="Mô tả"
                        placeholder="Nhập mô tả thương hiệu"
                        value={formik.values.description}
                        onChange={(value) => formik.setFieldValue('description', value)}
                        onBlur={() => formik.setFieldTouched('description', true)}
                        error={
                            formik.touched.description && formik.errors.description ? formik.errors.description : null
                        }
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

export default BrandForm;
