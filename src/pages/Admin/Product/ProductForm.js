import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Menu, message, Space, Upload, theme, TreeSelect } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';

import useDebounce from '~/hooks/useDebounce';
import { checkIdIsNumber } from '~/utils/helper';
import { handleError } from '~/utils/errorHandler';
import { getCategoriesTree } from '~/services/categoryService';
import { getBrands } from '~/services/brandService';
import { getAttributeByCategoryId } from '~/services/attributeService';
import { createProduct, getProductById, updateProduct } from '~/services/productService';
import { NumberInput, RichTextInput, SelectInput, TextInput } from '~/components/FormInput';

const entityListPage = '/admin/products';

const defaultValue = {
    name: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    stockQuantity: 0,
    categoryId: null,
    brandId: null,
    attributes: [],
};

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Không được để trống ô')
        .min(3, 'Độ dài tối thiểu là 3 ký tự')
        .max(255, 'Độ dài tối đa là 255 ký tự'),

    description: yup.string().required('Không được để trống ô'),

    price: yup
        .number()
        .typeError('Trường này bắt buộc là số')
        .required('Không được để trống ô')
        .min(1000, 'Giá trị tối thiểu là 1.000đ'),

    discountPercentage: yup
        .number()
        .typeError('Trường này bắt buộc là số')
        .required('Không được để trống ô')
        .min(0, 'Giá trị tối thiểu là 0')
        .max(100, 'Giá trị tối đa là 100'),

    stockQuantity: yup.number().typeError('Trường này bắt buộc là số nguyên').required('Không được để trống ô'),

    categoryId: yup.number().typeError('Trường này bắt buộc là số').required('Không được để trống ô'),

    brandId: yup.number().nullable(),
});

const getDynamicAttributeSchema = (attributeList) => {
    return yup.array().of(
        yup.object().shape({
            attributeId: yup.number().required(),
            value: yup.string().when('attributeId', ([attributeId], schema, context) => {
                const attr = attributeList.find((a) => a.id === Number(attributeId));
                if (attr?.isRequired) {
                    return schema.required('Không được để trống ô');
                }
                return schema;
            }),
        }),
    );
};

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const validateFile = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        return { result: false, message: 'Bạn chỉ có thể upload file hình ảnh!' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return { result: false, message: 'Kích thước file không được vượt quá 5MB!' };
    }

    return { result: true, message: 'OK!' };
};

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Thêm hình ảnh</div>
    </button>
);

const convertToTreeData = (categories) => {
    return categories.map((category) => {
        return {
            label: category.name,
            value: category.id,
            key: category.id.toString(),
            children:
                category.subCategories && category.subCategories.length > 0
                    ? convertToTreeData(category.subCategories)
                    : [],
            selectable: !(category.subCategories && category.subCategories.length > 0),
        };
    });
};

const menuItems = [
    {
        key: 'basic-info',
        label: <a href="#basic-info">Thông tin cơ bản</a>,
    },
    {
        key: 'detailed-info',
        label: <a href="#detailed-info">Thông tin chi tiết</a>,
    },
    {
        key: 'sales-info',
        label: <a href="#sales-info">Thông tin bán hàng</a>,
    },
];

function ProductForm() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [categoryList, setCategoryList] = useState([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const [brandList, setBrandList] = useState([]);
    const [brandSearchTerm, setBrandSearchTerm] = useState('');
    const debouncedBrandSearch = useDebounce(brandSearchTerm, 300);
    const [isBrandLoading, setIsBrandLoading] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const [attributeList, setAttributeList] = useState([]);

    const dynamicAttributeSchema = useMemo(() => {
        return getDynamicAttributeSchema(attributeList);
    }, [attributeList]);

    const fullValidationSchema = useMemo(() => {
        return validationSchema.shape({
            attributes: dynamicAttributeSchema,
        });
    }, [dynamicAttributeSchema]);

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
            if (id) {
                response = await updateProduct(id, values, fileList);
            } else {
                if (!fileList || fileList.length === 0) {
                    messageApi.warning('Vui lòng chọn ít nhất 1 hình ảnh!');
                    return;
                }
                response = await createProduct(values, fileList);
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
        validationSchema: fullValidationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            setIsCategoryLoading(true);
            try {
                const response = await getCategoriesTree();
                const treeData = convertToTreeData(response.data.data);
                setCategoryList(treeData);
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            } finally {
                setIsCategoryLoading(false);
            }
        };

        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            setIsBrandLoading(true);
            try {
                const params = queryString.stringify({ keyword: debouncedBrandSearch, searchBy: 'name' });
                const response = await getBrands(params);
                setBrandList(response.data.data.items);
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            } finally {
                setIsBrandLoading(false);
            }
        };

        fetchBrands();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedBrandSearch]);

    useEffect(() => {
        if (!formik.values.categoryId) {
            return;
        }

        const fetchAttributes = async () => {
            try {
                const response = await getAttributeByCategoryId(formik.values.categoryId);
                const items = response.data.data;

                setAttributeList(items);

                // Nếu đang tạo mới hoặc chưa có thuộc tính thì set mặc định từ API
                if (!id || !formik.values.attributes || formik.values.attributes.length === 0) {
                    formik.setFieldValue(
                        'attributes',
                        items.map((item) => ({
                            value: item.defaultValue || '',
                            attributeId: item.id,
                        })),
                    );
                } else {
                    // Khi đang chỉnh sửa, giữ lại giá trị đã nhập nếu trùng attributeId
                    const mergedAttributes = items.map((item) => {
                        const existing = formik.values.attributes.find((a) => a.attributeId === item.id);
                        return {
                            value: existing ? existing.value : item.defaultValue || '',
                            attributeId: item.id,
                        };
                    });

                    formik.setFieldValue('attributes', mergedAttributes);
                }
            } catch (error) {
                messageApi.error('Lỗi: ' + error.message);
            }
        };

        fetchAttributes();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.categoryId]);

    //Tải dữ liệu
    useEffect(() => {
        if (!id) return;

        if (!checkIdIsNumber(id)) {
            navigate(entityListPage);
            return;
        }

        const fetchEntity = async () => {
            try {
                const response = await getProductById(id);
                const { name, description, price, discountPercentage, stockQuantity, categoryId, brandId, attributes } =
                    response.data.data;
                formik.setValues({
                    name,
                    description,
                    price,
                    discountPercentage,
                    stockQuantity,
                    categoryId,
                    brandId,
                    attributes,
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
            <h2>{id ? 'Chỉnh sửa sản phẩm' : 'Thêm mới sản phẩm'}</h2>

            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 999,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    boxShadow: '0 1px 4px rgba(0, 0, 0, .12)',
                    marginBottom: 16,
                }}
            >
                <Menu mode="horizontal" items={menuItems} />
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div
                    id="basic-info"
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 1px 4px rgba(0, 0, 0, .12)',
                        marginBottom: 16,
                    }}
                >
                    <div className="row g-3">
                        <div className="col-12">
                            <h4>Thông tin cơ bản</h4>
                        </div>
                        <div className="col-12">
                            <span>
                                <span className="text-danger">*</span> Hình ảnh sản phẩm:
                            </span>
                            <div className="text-center">
                                <ImgCrop
                                    rotationSlider
                                    aspectSlider
                                    showReset
                                    aspect={3 / 4}
                                    resetText="Đặt lại"
                                    modalTitle="Chỉnh sửa hình ảnh"
                                    beforeCrop={handleBeforeCrop}
                                >
                                    <Upload
                                        accept="image/*"
                                        listType="picture-card"
                                        fileList={fileList}
                                        maxCount={10}
                                        onPreview={handlePreview}
                                        onChange={handleFileListChange}
                                        customRequest={handleCustomRequest}
                                    >
                                        {fileList.length >= 8 ? null : uploadButton}
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
                            id="name"
                            className="col-12"
                            label="Tên sản phẩm"
                            placeholder="Nhập tên sản phẩm"
                            helperText="Tên sản phẩm từ 3-255 kí tự"
                            autoComplete="on"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                        />

                        <div className="col-12">
                            <label htmlFor="categoryId">
                                <span className="text-danger">*</span> Danh mục sản phẩm:
                            </label>
                            <TreeSelect
                                id="categoryId"
                                placeholder="Chọn danh mục"
                                loading={isCategoryLoading}
                                treeData={categoryList}
                                value={formik.values.categoryId}
                                onChange={(value) => formik.setFieldValue('categoryId', value)}
                                onBlur={() => formik.setFieldTouched('categoryId', true)}
                                status={formik.touched.categoryId && formik.errors.categoryId ? 'error' : undefined}
                                className="w-100"
                            />
                            {formik.touched.categoryId && formik.errors.categoryId ? (
                                <div className="text-danger mt-1">{formik.errors.categoryId}</div>
                            ) : null}
                        </div>

                        <SelectInput
                            id="brandId"
                            label="Thương hiệu"
                            placeholder="Chọn thương hiệu"
                            className="col-12"
                            loading={isBrandLoading}
                            onSearch={setBrandSearchTerm}
                            fieldNames={{ label: 'name', value: 'id' }}
                            value={formik.values.brandId}
                            onChange={(value) => formik.setFieldValue('brandId', value)}
                            onBlur={() => formik.setFieldTouched('brandId', true)}
                            options={brandList}
                            error={formik.touched.brandId && formik.errors.brandId ? formik.errors.brandId : null}
                        />

                        <RichTextInput
                            required
                            id="description"
                            className="col-12"
                            label="Mô tả sản phẩm"
                            placeholder="Nhập mô tả sản phẩm"
                            value={formik.values.description}
                            onChange={(value) => formik.setFieldValue('description', value)}
                            onBlur={() => formik.setFieldTouched('description', true)}
                            error={
                                formik.touched.description && formik.errors.description
                                    ? formik.errors.description
                                    : null
                            }
                        />
                    </div>
                </div>

                <div
                    id="detailed-info"
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 1px 4px rgba(0, 0, 0, .12)',
                        marginBottom: 16,
                    }}
                >
                    <div className="row g-3">
                        <div className="col-12">
                            <h4>Thông tin chi tiết</h4>
                        </div>
                        {attributeList.length > 0 ? (
                            attributeList.map(({ id, name, isRequired }, index) => (
                                <TextInput
                                    key={index}
                                    required={isRequired}
                                    id={id}
                                    name={`attributes[${index}].value`}
                                    className="col-md-6 col-12"
                                    label={name}
                                    placeholder={`Nhập ${name}`}
                                    value={formik.values.attributes[index]?.value || ''}
                                    onChange={(e) => {
                                        const newAttributes = [...formik.values.attributes];
                                        newAttributes[index] = {
                                            ...newAttributes[index],
                                            value: e.target.value,
                                            attributeId: id,
                                        };
                                        formik.setFieldValue('attributes', newAttributes);
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.attributes?.[index]?.value &&
                                        formik.errors.attributes?.[index]?.value
                                            ? formik.errors.attributes[index].value
                                            : null
                                    }
                                />
                            ))
                        ) : (
                            <span>Có thể điều chỉnh sau khi chọn danh mục</span>
                        )}
                    </div>
                </div>

                <div
                    id="sales-info"
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 1px 4px rgba(0, 0, 0, .12)',
                        marginBottom: 16,
                    }}
                >
                    <div className="row g-3">
                        <div className="col-12">
                            <h4>Thông tin bán hàng</h4>
                        </div>
                        <NumberInput
                            required
                            id="price"
                            className="col-12"
                            label="Giá sản phẩm"
                            placeholder="Nhập giá sản phẩm"
                            value={formik.values.price}
                            onChange={(value) => formik.setFieldValue('price', value)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.price && formik.errors.price ? formik.errors.price : null}
                        />

                        <NumberInput
                            id="discountPercentage"
                            className="col-12"
                            label="Giảm giá (%)"
                            placeholder="Nhập phần trăm giảm giá"
                            min={0}
                            max={100}
                            value={formik.values.discountPercentage}
                            onChange={(value) => formik.setFieldValue('discountPercentage', value)}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.discountPercentage && formik.errors.discountPercentage
                                    ? formik.errors.discountPercentage
                                    : null
                            }
                        />

                        <NumberInput
                            required
                            id="stockQuantity"
                            className="col-12"
                            label="Số lượng tồn kho"
                            placeholder="Nhập số lượng tồn kho"
                            min={0}
                            value={formik.values.stockQuantity}
                            onChange={(value) => formik.setFieldValue('stockQuantity', value)}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.stockQuantity && formik.errors.stockQuantity
                                    ? formik.errors.stockQuantity
                                    : null
                            }
                        />
                    </div>
                </div>

                <div className="row">
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

export default ProductForm;
