import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Input, message, Space, Upload } from 'antd';

import { useFormik } from 'formik';
import * as yup from 'yup';

import useDebounce from '~/hooks/useDebounce';
import { checkIdIsNumber } from '~/utils/helper';
import { handleError } from '~/utils/errorHandler';
import { getCategories } from '~/services/categoryService';
import { getBrands } from '~/services/brandService';
import { getAttributeByCategoryId } from '~/services/attributeService';
import { createProduct, getProductById, updateProduct } from '~/services/productService';
import { NumberInput, SelectInput, TextAreaInput, TextInput } from '~/components/FormInput';

const entityListPage = '/admin/news';

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

const validationSchema = yup.object({});

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
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
);

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [categoryList, setCategoryList] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const [brandList, setBrandList] = useState([]);
    const [brandSearchTerm, setBrandSearchTerm] = useState('');
    const debouncedBrandSearch = useDebounce(brandSearchTerm, 300);
    const [isBrandLoading, setIsBrandLoading] = useState(false);

    const [attributeList, setAttributeList] = useState([]);

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
                    messageApi.warning('Vui lòng chọn một ảnh bìa');
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
                formik.setFieldValue(
                    'attributes',
                    items.map((item) => ({
                        value: item.defaultValue,
                        attributeId: item.id,
                    })),
                );
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
                const { name } = response.data.data;
                console.log(name);
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

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <div className="col-12">
                        <h2>Thông tin cơ bản</h2>
                    </div>
                    <div className="col-12">
                        <span>
                            <span className="text-danger">*</span> Ảnh bìa sản phẩm:
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
                        helperText="Tên sản phẩm từ 3-500 kí tự"
                        autoComplete="on"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                    />

                    <SelectInput
                        required
                        id="categoryId"
                        label="Danh mục"
                        placeholder="Chọn danh mục"
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
                            formik.touched.description && formik.errors.description ? formik.errors.description : null
                        }
                    />
                </div>

                <div className="row g-3">
                    <div className="col-12">
                        <h2>Thông tin chi tiết</h2>
                    </div>
                    {attributeList.map(({ id, name, required }, index) => (
                        <div key={index} className="col-md-6 col-12">
                            <label htmlFor={id}>
                                {required && <span className="text-danger">*</span>} {name}:
                            </label>

                            <Input
                                id={id}
                                name={id}
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
                            />
                        </div>
                    ))}
                </div>

                <div className="row g-3">
                    <div className="col-12">
                        <h2>Thông tin bán hàng</h2>
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
