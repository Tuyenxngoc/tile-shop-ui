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
import { createProduct, getProductById, updateProduct } from '~/services/productService';
import { getCategories } from '~/services/categoryService';
import { SelectInput, TextAreaInput, TextInput } from '~/components/FormInput';
import { getAttributeByCategoryId } from '~/services/attributeService';
import { getBrands } from '~/services/brandService';

const entityListPage = '/admin/news';

const defaultValue = {
    name: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    stockQuantity: 0,
    categoryId: null,
    brandId: null,
    attributes: [
        {
            value: '0',
            attributeId: 0,
        },
    ],
};

const validationSchema = yup.object({});

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const validateFile2 = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return false;
    }

    return true;
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
    const [attributeValues, setAttributeValues] = useState({});

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

    const handleFileListChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const validateFile = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            messageApi.error('Bạn chỉ có thể upload file hình ảnh!');
            return false;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            messageApi.error('Kích thước file không được vượt quá 5MB!');
            return false;
        }

        return true;
    };

    const handleChange = (attId, value) => {
        setAttributeValues((prev) => ({
            ...prev,
            [attId]: value,
        }));
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

                setAttributeList(response.data.data);
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
                                beforeCrop={validateFile}
                            >
                                <Upload
                                    accept="image/*"
                                    listType="picture-card"
                                    fileList={fileList}
                                    maxCount={10}
                                    onPreview={handlePreview}
                                    onChange={handleFileListChange}
                                    beforeUpload={validateFile2}
                                    customRequest={({ file, onSuccess }) => {
                                        // setFileList((prevFileList) => [
                                        //     ...prevFileList,
                                        //     {
                                        //         uid: file.uid,
                                        //         name: file.name,
                                        //         status: 'done',
                                        //         url: URL.createObjectURL(file),
                                        //     },
                                        // ]);
                                        onSuccess();
                                    }}
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
                    {attributeList.map(({ id, name, required, defaultValue }) => (
                        <div key={id} className="col-md-6 col-12">
                            <label htmlFor={id}>
                                {required && <span className="text-danger">*</span>} {name}:
                            </label>

                            <Input
                                id={id}
                                name={id}
                                placeholder={`Nhập ${name}`}
                                value={attributeValues[id] || ''}
                                onChange={(e) => handleChange(id, e.target.value)}
                            />
                        </div>
                    ))}
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
