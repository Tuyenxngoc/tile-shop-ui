import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';
import { Button, Image, message, Space, Upload } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { MdOutlineFileUpload } from 'react-icons/md';

import images from '~/assets';
import useDebounce from '~/hooks/useDebounce';
import { checkIdIsNumber } from '~/utils/helper';
import { handleError } from '~/utils/errorHandler';
import { getNewsCategories } from '~/services/newsCategoryService';
import { createNews, getNewsById, updateNews } from '~/services/newsService';
import { RichTextInput, TextInput, TextAreaInput, SelectInput } from '~/components/FormInput';

const entityListPage = '/admin/news';

const defaultValue = {
    title: '',
    description: '',
    content: '',
    categoryId: null,
};

const validationSchema = yup.object({
    title: yup.string().required('Tiêu đề là bắt buộc'),
    description: yup.string().required('Mô tả là bắt buộc'),
    content: yup.string().required('Nội dung là bắt buộc'),
    categoryId: yup.number().required('Loại tin tức là bắt buộc'),
});

function NewsForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [categoryList, setCategoryList] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

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
                response = await updateNews(id, values, uploadedImage);
            } else {
                if (!uploadedImage) {
                    messageApi.warning('Vui lòng chọn một ảnh bìa');
                    return;
                }
                response = await createNews(values, uploadedImage);
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
    }, [debouncedCategorySearch, messageApi]);

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
                const { title, description, content, category, imageUrl } = response.data.data;

                setPreviewImage(imageUrl);
                formik.setValues({
                    title,
                    description,
                    content,
                    categoryId: category ? category.id : null,
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
            <h2>{id ? 'Chỉnh sửa tin tức' : 'Thêm mới tin tức'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-8 col-12">
                        <div className="row g-3">
                            <TextInput
                                required
                                id="title"
                                className="col-12"
                                label="Tiêu đề"
                                placeholder="Nhập tiêu đề"
                                helperText="Tiêu đề từ 3-500 kí tự"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && formik.errors.title ? formik.errors.title : null}
                            />

                            <TextAreaInput
                                required
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

                            <SelectInput
                                required
                                id="categoryId"
                                label="Danh mục"
                                placeholder="Chọn danh mục cho tin tức"
                                className="col-12"
                                loading={isCategoryLoading}
                                onSearch={setCategorySearchTerm}
                                fieldNames={{ label: 'name', value: 'id' }}
                                value={formik.values.categoryId}
                                onChange={(value) => formik.setFieldValue('categoryId', value)}
                                onBlur={() => formik.setFieldTouched('categoryId', true)}
                                options={categoryList}
                                error={
                                    formik.touched.categoryId && formik.errors.categoryId
                                        ? formik.errors.categoryId
                                        : null
                                }
                            />

                            <RichTextInput
                                id="content"
                                required
                                className="col-12"
                                label="Nội dung bài viết"
                                placeholder="Nhập nội dung bài viết"
                                value={formik.values.content}
                                onChange={(value) => formik.setFieldValue('content', value)}
                                onBlur={() => formik.setFieldTouched('content', true)}
                                error={formik.touched.content && formik.errors.content ? formik.errors.content : null}
                            />
                        </div>
                    </div>

                    <div className="col-md-4 col-12">
                        <span>
                            <span className="text-danger">*</span> Ảnh bìa tin tức:
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

export default NewsForm;
