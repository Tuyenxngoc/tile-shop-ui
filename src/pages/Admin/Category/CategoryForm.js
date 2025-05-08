import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { ArrowDownOutlined, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, message, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import slugify from 'slugify';

import { getBase64, validateFile } from '~/utils';
import { checkIdIsNumber } from '~/utils/helper';
import { handleError } from '~/utils/errorHandler';
import { getAttributes } from '~/services/attributeService';
import { createCategory, getCategories, getCategoryById, updateCategory } from '~/services/categoryService';
import useDebounce from '~/hooks/useDebounce';
import TableTransfer from '~/components/TableTransfer';
import { RichTextInput, SelectInput, TextInput } from '~/components/FormInput';

const entityListPage = '/admin/categories';
const maxImageCount = 1;

const defaultValue = {
    name: '',
    slug: '',
    description: '',
    parentId: null,
    attributeIds: [],
};

const validationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required('Tên danh mục là bắt buộc')
        .max(255, 'Tên danh mục không được vượt quá 255 ký tự'),

    slug: yup.string().trim().required('Đường dẫn là bắt buộc').max(255, 'Đường dẫn không được vượt quá 255 ký tự'),

    parentId: yup.number().nullable(),

    attributeIds: yup
        .array()
        .of(yup.number().typeError('ID thuộc tính phải là số').required('ID thuộc tính là bắt buộc')),
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

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Thêm hình ảnh</div>
    </button>
);

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
                response = await updateCategory(id, values, image);
            } else {
                response = await createCategory(values, image);
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

    useEffect(() => {
        const fetchCategories = async () => {
            setIsCategoryLoading(true);
            try {
                const response = await getCategories({ keyword: debouncedCategorySearch, searchBy: 'name' });
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
                const response = await getAttributes({ keyword: debouncedAttributeSearch, searchBy: 'name' });
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
                const { name, slug, description, imageUrl, parent, attributeIds } = response.data.data;
                const parentId = parent?.id;
                formik.setValues({ name, slug, description, parentId, attributeIds });

                if (imageUrl) {
                    const mappedImages = [
                        {
                            uid: '1',
                            name: 'image-1.jpg',
                            status: 'done',
                            url: imageUrl,
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
            <h2>{id ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <div className="col-12">
                        <span>Ảnh bìa danh mục:</span>
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
                        maxLength={255}
                        showCount
                        id="name"
                        className="col-12 col-md-5"
                        label="Tên danh mục"
                        placeholder="Nhập tên danh mục"
                        helperText="Tên danh mục tối đa 255 kí tự"
                        autoComplete="on"
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
                        label="Đường dẫn danh mục"
                        placeholder="Ví dụ: ao-thun-nam-tron"
                        helperText="Chuỗi không dấu, cách nhau bằng dấu gạch ngang (-), tối đa 255 ký tự."
                        value={formik.values.slug}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.slug && formik.errors.slug ? formik.errors.slug : null}
                    />

                    <SelectInput
                        id="parentId"
                        label="Danh mục cha"
                        placeholder="Chọn danh mục cha"
                        className="col-12"
                        loading={isCategoryLoading}
                        onSearch={setCategorySearchTerm}
                        fieldNames={{ label: 'name', value: 'id' }}
                        value={formik.values.parentId}
                        onChange={(value) => formik.setFieldValue('parentId', value)}
                        onBlur={() => formik.setFieldTouched('parentId', true)}
                        options={categoryList}
                        error={formik.touched.parentId && formik.errors.parentId ? formik.errors.parentId : null}
                    />

                    <RichTextInput
                        id="description"
                        className="col-12"
                        label="Mô tả danh mục"
                        placeholder="Nhập mô tả danh mục"
                        value={formik.values.description}
                        onChange={(value) => formik.setFieldValue('description', value)}
                        onBlur={() => formik.setFieldTouched('description', true)}
                        error={
                            formik.touched.description && formik.errors.description ? formik.errors.description : null
                        }
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

export default CategoryForm;
