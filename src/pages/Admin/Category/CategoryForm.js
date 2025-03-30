import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import queryString from 'query-string';
import { Button, message, Space } from 'antd';

import { handleError } from '~/utils/errorHandler';
import { checkIdIsNumber } from '~/utils/helper';
import { getAttributes } from '~/services/attributeService';
import { createCategory, getCategories, getCategoryById, updateCategory } from '~/services/categoryService';
import useDebounce from '~/hooks/useDebounce';
import TableTransfer from '~/components/TableTransfer';
import { SelectInput, TextInput } from '~/components/FormInput';

const entityListPage = '/admin/categories';

const defaultValue = {
    name: '',
    parentId: null,
    attributeIds: [],
};

const validationSchema = yup.object({
    name: yup.string().required('Tên danh mục là bắt buộc'),
});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        showSorterTooltip: false,
    },
    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        showSorterTooltip: false,
    },
];

function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [categoryList, setCategoryList] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const [attributeList, setAttributeList] = useState([]);
    const [attributeSearchTerm, setAttributeSearchTerm] = useState('');
    const debouncedAttributeSearch = useDebounce(attributeSearchTerm, 300);
    const [isAttributeLoading, setIsAttributeLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;
            if (id) {
                response = await updateCategory(id, values);
            } else {
                response = await createCategory(values);
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
                const response = await getCategories(params);
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

    useEffect(() => {
        const fetchAttributes = async () => {
            setIsAttributeLoading(true);
            try {
                const params = queryString.stringify({ keyword: debouncedAttributeSearch, searchBy: 'name' });
                const response = await getAttributes(params);
                const { items } = response.data.data;
                setAttributeList(
                    items.map((attr) => ({
                        key: attr.id,
                        id: attr.id,
                        name: attr.name,
                    })),
                );
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            } finally {
                setIsAttributeLoading(false);
            }
        };

        fetchAttributes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedAttributeSearch]);

    //Tải dữ liệu
    useEffect(() => {
        if (!id) return;

        if (!checkIdIsNumber(id)) {
            navigate(entityListPage);
            return;
        }

        const fetchEntity = async () => {
            try {
                const response = await getCategoryById(id);
                const { name, parent, attributeIds } = response.data.data;
                const parentId = parent?.id;
                formik.setValues({ name, parentId, attributeIds });
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
            <h2>{id ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <TextInput
                        id="name"
                        required
                        className="col-md-6"
                        label="Tên danh mục"
                        placeholder="Nhập tên danh mục"
                        helperText="Tên danh mục từ 3-100 kí tự"
                        autoComplete="off"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                    />

                    <SelectInput
                        id="parentId"
                        label="Danh mục"
                        placeholder="Chọn danh mục cha"
                        className="col-md-6"
                        loading={isCategoryLoading}
                        onSearch={setCategorySearchTerm}
                        fieldNames={{ label: 'name', value: 'id' }}
                        value={formik.values.parentId}
                        onChange={(value) => formik.setFieldValue('parentId', value)}
                        onBlur={() => formik.setFieldTouched('parentId', true)}
                        options={categoryList}
                        error={formik.touched.parentId && formik.errors.parentId ? formik.errors.parentId : null}
                    />

                    <div className="col-12">
                        <span>Danh sách thuộc tính:</span>
                        <TableTransfer
                            dataSource={attributeList}
                            targetKeys={formik.values.attributeIds}
                            loading={isAttributeLoading}
                            showSearch
                            showSelectAll={false}
                            onChange={(nextTargetKeys) => formik.setFieldValue('attributeIds', nextTargetKeys)}
                            filterOption={setAttributeSearchTerm}
                            leftColumns={columns}
                            rightColumns={columns}
                        />
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

export default CategoryForm;
