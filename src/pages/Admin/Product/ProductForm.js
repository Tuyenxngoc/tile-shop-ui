import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ImgCrop from 'antd-img-crop';
import { ArrowDownOutlined, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, Menu, message, Space, Upload, theme, TreeSelect } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';
import slugify from 'slugify';

import useDebounce from '~/hooks/useDebounce';
import { checkIdIsNumber } from '~/utils/helper';
import { handleError } from '~/utils/errorHandler';
import { getBase64, validateFile } from '~/utils';
import { getCategoriesTree } from '~/services/categoryService';
import { getBrands } from '~/services/brandService';
import { getAttributeByCategoryId } from '~/services/attributeService';
import { createProduct, getProductById, updateProduct } from '~/services/productService';
import { NumberInput, RichTextInput, SelectInput, TextInput } from '~/components/FormInput';

const entityListPage = '/admin/products';
const maxImageCount = 10;

const defaultValue = {
    name: '',
    slug: '',
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
        .trim()
        .required('Không được để trống ô')
        .min(3, 'Độ dài tối thiểu là 3 ký tự')
        .max(255, 'Độ dài tối đa là 255 ký tự'),

    slug: yup
        .string()
        .trim()
        .required('Không được để trống ô')
        .min(3, 'Độ dài tối thiểu là 3 ký tự')
        .max(255, 'Độ dài tối đa là 255 ký tự'),

    description: yup.string().trim().required('Không được để trống ô'),

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
            value: yup
                .string()
                .trim()
                .when('attributeId', ([attributeId], schema, context) => {
                    const attr = attributeList.find((a) => a.id === Number(attributeId));
                    if (attr?.isRequired) {
                        return schema.required('Không được để trống ô');
                    }
                    return schema;
                }),
        }),
    );
};

const formatVND = (value) => {
    if (!value) return '';
    // Xóa ký tự không phải số và định dạng lại thành tiền tệ
    value = value.replace(/\D/g, '');
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₫';
};

const parseVND = (value) => {
    // Loại bỏ ký tự '₫' và các dấu phẩy
    return value.replace(/[^\d]/g, '');
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

    const [activeKey, setActiveKey] = useState(menuItems[0].key);

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
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setActiveKey(hash || menuItems[0].key); // default nếu không có hash
        };

        // Gọi lần đầu khi component mount
        handleHashChange();

        // Lắng nghe sự kiện hash change
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup event
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

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
                const response = await getBrands({ keyword: debouncedBrandSearch, searchBy: 'name' });
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
                const {
                    name,
                    slug,
                    description,
                    price,
                    discountPercentage,
                    stockQuantity,
                    categoryId,
                    brandId,
                    attributes,
                    images,
                } = response.data.data;

                formik.setValues({
                    name,
                    slug,
                    description,
                    price,
                    discountPercentage,
                    stockQuantity,
                    categoryId,
                    brandId,
                    attributes,
                });

                if (images && images.length > 0) {
                    const mappedImages = images.map((img, index) => ({
                        uid: `${index}`,
                        name: `image-${index}.jpg`,
                        status: 'done',
                        url: img,
                    }));
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
                <Menu mode="horizontal" selectedKeys={[activeKey]} items={menuItems} />
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
                            label="Tên sản phẩm"
                            placeholder="Nhập tên sản phẩm"
                            helperText="Tên sản phẩm từ 3-255 kí tự"
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
                            label="Đường dẫn sản phẩm"
                            placeholder="Ví dụ: ao-thun-nam-tron"
                            helperText="Chuỗi không dấu, cách nhau bằng dấu gạch ngang (-), từ 3-255 ký tự."
                            value={formik.values.slug}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.slug && formik.errors.slug ? formik.errors.slug : null}
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
                            style={{ width: '70%' }}
                            formatter={formatVND}
                            parser={parseVND}
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
                            style={{ width: '70%' }}
                            required
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
                            style={{ width: '70%' }}
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
