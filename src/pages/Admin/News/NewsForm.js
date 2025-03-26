import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { MdOutlineFileUpload } from 'react-icons/md';
import { Button, Image, message, Space, Upload } from 'antd';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';

import images from '~/assets';
import { handleError } from '~/utils/errorHandler';
import { checkIdIsNumber } from '~/utils/helper';
import { formats, modules as defaultModules } from '~/constants/editorConfig';
import { uploadFiles } from '~/services/userService';
import { createNews, getNewsById, updateNews } from '~/services/newsService';

const defaultValue = {
    title: '',
    categoryId: '',
    description: '',
    content: '',
    image: null,
};

const validationSchema = yup.object({
    title: yup.string().required('Tiêu đề là bắt buộc'),

    categoryId: yup.string().required('Loại tin tức là bắt buộc'),

    content: yup.string().required('Nội dung là bắt buộc'),
});

function NewsForm() {
    const reactQuillRef = useRef(null);

    const { id } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [fileList, setFileList] = useState([]);
    const [previousImage, setPreviousImage] = useState(images.placeimgHorizontal);

    const handleUploadChange = ({ file, fileList }) => {
        setFileList(fileList);

        const { originFileObj } = file;
        if (!originFileObj) {
            return;
        }

        // Tạo URL cho hình ảnh và cập nhật giá trị trong form
        const url = URL.createObjectURL(originFileObj);
        setPreviousImage(url);
        formik.setFieldValue('image', originFileObj);
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const file = input.files[0];
                const loadingMessage = message.loading({ content: 'Đang tải ảnh lên...', duration: 0 });
                try {
                    const response = await uploadFiles([file]);
                    const quill = reactQuillRef.current;
                    if (quill && response.data) {
                        const range = quill.getEditorSelection();
                        range && quill.getEditor().insertEmbed(range.index, 'image', response.data.data[0]);
                        message.success({ content: 'Tải ảnh thành công!', duration: 2 });
                    }
                } catch (error) {
                    message.error({ content: 'Đã xảy ra lỗi khi tải ảnh lên.', duration: 2 });
                } finally {
                    if (loadingMessage) {
                        loadingMessage();
                    }
                }
            }
        };
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;
            if (id) {
                response = await updateNews(id, values);
            } else {
                response = await createNews(values);
            }

            if (response.status === 200) {
                messageApi.success(response.data.data.message);
            } else if (response.status === 201) {
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
        if (id) {
            if (!checkIdIsNumber(id)) {
                navigate('/admin/news-articles');
                return;
            }

            // Nếu có id, lấy thông tin tin tức để sửa
            getNewsById(id)
                .then((response) => {
                    const { title, newsType, description, imageUrl, content } = response.data.data;

                    formik.setValues({
                        title,
                        newsType,
                        description,
                        imageUrl,
                        content,
                    });

                    setPreviousImage(imageUrl);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const modules = {
        ...defaultModules,
        toolbar: {
            ...defaultModules.toolbar,
            handlers: {
                ...defaultModules.toolbar.handlers,
                image: imageHandler,
            },
        },
    };

    return (
        <>
            {contextHolder}
            <h2>{id ? 'Chỉnh sửa tin tức' : 'Thêm mới tin tức'}</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-4 text-center">
                        <Image width={200} src={previousImage} fallback={images.placeimgHorizontal} />

                        <Upload
                            className="d-block mt-2"
                            accept="image/*"
                            fileList={fileList}
                            maxCount={1}
                            showUploadList={false}
                            beforeUpload={(file) => {
                                const isImage = file.type.startsWith('image/');
                                if (!isImage) {
                                    messageApi.error('Bạn chỉ có thể upload file hình ảnh!');
                                }
                                return isImage;
                            }}
                            onChange={handleUploadChange}
                            customRequest={() => false}
                        >
                            <Button icon={<MdOutlineFileUpload />}>Chọn ảnh bìa</Button>
                        </Upload>
                    </div>

                    <div className="col-md-12">
                        <span>
                            <span className="text-danger">*</span>Nội dung:
                        </span>
                        <ReactQuill
                            ref={reactQuillRef}
                            className="custom-quill"
                            placeholder="Nhập nội dung bài viết"
                            value={formik.values.content}
                            modules={modules}
                            formats={formats}
                            onChange={(value) => formik.setFieldValue('content', value)}
                            onBlur={() => formik.setFieldTouched('content', true)}
                        />
                        {formik.touched.content && formik.errors.content ? (
                            <div className="text-danger">{formik.errors.content}</div>
                        ) : null}
                    </div>

                    <div className="col-md-12 text-end">
                        <Space>
                            <Button onClick={() => navigate('/admin/news-articles')}>Quay lại</Button>
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
