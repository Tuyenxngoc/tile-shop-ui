import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';
import ImgCrop from 'antd-img-crop';
import { ArrowDownOutlined, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, message, Space, Upload } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';
import slugify from 'slugify';

import useDebounce from '~/hooks/useDebounce';
import { getBase64, validateFile } from '~/utils';
import { checkIdIsNumber } from '~/utils/helper';
import { handleError } from '~/utils/errorHandler';
import { getNewsCategories } from '~/services/newsCategoryService';
import { createNews, getNewsById, updateNews } from '~/services/newsService';
import { RichTextInput, TextInput, TextAreaInput, SelectInput } from '~/components/FormInput';

const entityListPage = '/admin/news';
const maxImageCount = 1;

const defaultValue = {
    title: '',
    slug: '',
    description: '',
    content: '',
    categoryId: null,
};

const validationSchema = yup.object({
    title: yup.string().required('Tiêu đề là bắt buộc'),
    slug: yup.string().required('Slug bài viết là bắt buộc'),
    description: yup.string().required('Mô tả là bắt buộc'),
    content: yup.string().required('Nội dung là bắt buộc'),
    categoryId: yup.number().required('Loại tin tức là bắt buộc'),
});

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Thêm hình ảnh</div>
    </button>
);

function NewsForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [categoryList, setCategoryList] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

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
                response = await updateNews(id, values, image);
            } else {
                if (!image) {
                    messageApi.warning('Vui lòng chọn hình ảnh!');
                    return;
                }
                response = await createNews(values, image);
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
        if (formik.values.title) {
            const generatedSlug = slugify(formik.values.title, { lower: true, strict: true });
            formik.setFieldValue('slug', generatedSlug);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.title]);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsCategoryLoading(true);
            try {
                const params = queryString.stringify({ keyword: debouncedCategorySearch, searchBy: 'name' });
                const response = await getNewsCategories(params);

                const { items } = response.data.data;
                setCategoryList(items);
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            } finally {
                setIsCategoryLoading(false);
            }
        };

        fetchCategories();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedCategorySearch]);

    //Tải dữ liệu
    useEffect(() => {
        if (!id) return;

        if (!checkIdIsNumber(id)) {
            navigate(entityListPage);
            return;
        }

        const fetchEntity = async () => {
            try {
                const response = await getNewsById(id);
                const { title, slug, description, content, category, imageUrl } = response.data.data;

                formik.setValues({
                    title,
                    slug,
                    description,
                    content,
                    categoryId: category ? category.id : null,
                });

                const mappedImages = [
                    {
                        uid: '1',
                        name: 'image-1.jpg',
                        status: 'done',
                        url: imageUrl,
                    },
                ];
                setFileList(mappedImages);
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
            <h2>{id ? 'Chỉnh sửa tin tức' : 'Thêm mới tin tức'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <div className="col-12">
                        <span>
                            <span className="text-danger">*</span> Ảnh bìa tin tức:
                        </span>
                        <div className="text-center">
                            <ImgCrop
                                rotationSlider
                                aspectSlider
                                showReset
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
                        id="title"
                        className="col-12 col-md-5"
                        label="Tiêu đề"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && formik.errors.title ? formik.errors.title : null}
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
                        label="Slug bài viết"
                        value={formik.values.slug}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.slug && formik.errors.slug ? formik.errors.slug : null}
                    />

                    <TextAreaInput
                        required
                        id="description"
                        className="col-12"
                        label="Mô tả chi tiết"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.description && formik.errors.description ? formik.errors.description : null
                        }
                    />

                    <SelectInput
                        required
                        id="categoryId"
                        label="Chọn loại tin tức"
                        className="col-12"
                        loading={isCategoryLoading}
                        onSearch={setCategorySearchTerm}
                        fieldNames={{ label: 'name', value: 'id' }}
                        value={formik.values.categoryId}
                        onChange={(value) => formik.setFieldValue('categoryId', value)}
                        onBlur={() => formik.setFieldTouched('categoryId', true)}
                        options={categoryList}
                        error={formik.touched.categoryId && formik.errors.categoryId ? formik.errors.categoryId : null}
                    />

                    <RichTextInput
                        id="content"
                        required
                        className="col-12"
                        label="Nội dung bài viết"
                        value={formik.values.content}
                        onChange={(value) => formik.setFieldValue('content', value)}
                        onBlur={() => formik.setFieldTouched('content', true)}
                        error={formik.touched.content && formik.errors.content ? formik.errors.content : null}
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

export default NewsForm;
