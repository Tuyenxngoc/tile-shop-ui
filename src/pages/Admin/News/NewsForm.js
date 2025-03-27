import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';
import { Button, message, Space } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';

import useDebounce from '~/hooks/useDebounce';
import { handleError } from '~/utils/errorHandler';
import { createNews, updateNews } from '~/services/newsService';
import { getNewsCategories } from '~/services/newsCategoryService';
import { RichTextInput, TextInput, TextAreaInput, SelectInput, ImageUploadInput } from '~/components/FormikInputs';
import images from '~/assets';

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

    const [image, setImage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [categoryList, setCategoryList] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;
            if (id) {
                response = await updateNews(id, values, image);
            } else {
                response = await createNews(values, image);
            }

            if (response.status === 200 || response.status === 201) {
                messageApi.success(response.data.data.message);

                navigate('/admin/news');
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
                messageApi.error('Lỗi khi tải danh mục!');
            } finally {
                setIsCategoryLoading(false);
            }
        };

        fetchCategories();
    }, [debouncedCategorySearch, messageApi]);

    return (
        <>
            {contextHolder}
            <h2>{id ? 'Chỉnh sửa tin tức' : 'Thêm mới tin tức'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-md-8 col-12">
                        <div className="row g-3">
                            <TextInput
                                id="title"
                                required
                                className="col-12"
                                label="Tiêu đề"
                                placeholder="Nhập tiêu đề"
                                helperText="Tiêu đề không quá 500 kí tự"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && formik.errors.title ? formik.errors.title : null}
                            />

                            <TextAreaInput
                                id="description"
                                required
                                className="col-12"
                                label="Mô tả"
                                placeholder="Nhập mô tả"
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
                                className="col-12"
                                formik={formik}
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
                        <ImageUploadInput
                            label="Chọn ảnh bìa"
                            width={300}
                            defaultImage={images.placeimgHorizontal}
                            onImageSelect={setImage}
                        />
                    </div>

                    <div className="col-md-12 text-end">
                        <Space>
                            <Button onClick={() => navigate('/admin/news')}>Quay lại</Button>
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
