import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Select } from 'antd';
import { Button, Input, message, Space } from 'antd';

import { handleError } from '~/utils/errorHandler';
import { checkIdIsNumber } from '~/utils/helper';
import { createCategory, getCategories, getCategoryById, updateCategory } from '~/services/categoryService';
import queryString from 'query-string';
import useDebounce from '~/hooks/useDebounce';

const defaultValue = {
    name: '',
    parentId: null,
    attributeIds: [],
};

const validationSchema = yup.object({
    name: yup.string().required('Tên danh mục là bắt buộc'),
});

function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [categoryList, setCategoryList] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;
            if (id) {
                response = await updateCategory(id, values);
            } else {
                response = await createCategory(values);
            }

            if (response.status === 200 || response.status === 201) {
                messageApi.success(response.data.data.message);
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
                const response = await getCategories(params);

                const { items } = response.data.data;
                setCategoryList(
                    items.map((category) => ({
                        value: category.id,
                        label: category.name,
                    })),
                );
            } catch (error) {
                messageApi.error('Lỗi khi tải danh mục!');
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
            navigate('/admin/categories');
            return;
        }

        const fetchCategory = async () => {
            try {
                const response = await getCategoryById(id);
                const { name, parent } = response.data.data;

                const parentId = parent?.id;
                formik.setValues({ name, parentId });
            } catch (error) {
                messageApi.error('Không tìm thấy danh mục!');
            }
        };

        fetchCategory();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            {contextHolder}
            <h2>{id ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="name">
                            <span className="text-danger">*</span> Tên danh mục:
                        </label>
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

                    <div className="col-md-6">
                        <label htmlFor="parentId">Danh mục cha:</label>
                        <Select
                            allowClear
                            showSearch
                            onSearch={setCategorySearchTerm}
                            id="parentId"
                            name="parentId"
                            loading={isCategoryLoading}
                            options={categoryList}
                            value={formik.values.parentId}
                            onChange={(value) => formik.setFieldValue('parentId', value)}
                            onBlur={() => formik.setFieldTouched('parentId', true)}
                            className="w-100"
                        />
                    </div>

                    <div className="col-12">
                        <label htmlFor="penName">Danh sách thuộc tính:</label>
                    </div>

                    <div className="col-md-12 text-end">
                        <Space>
                            <Button onClick={() => navigate('/admin/categories')}>Quay lại</Button>
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

export default CategoryForm;
