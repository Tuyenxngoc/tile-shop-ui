import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Flex,
    Form,
    Image,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Space,
    Table,
    Tooltip,
    Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MdOutlineModeEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import ImgCrop from 'antd-img-crop';

import { createSlide, deleteSlide, getSlides, updateSlide } from '~/services/slideService';
import { getBase64, validateFile } from '~/utils';

const maxImageCount = 1;

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Thêm hình ảnh</div>
    </button>
);

function Slide() {
    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

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

    const openCreateModal = () => {
        setIsModalOpen(true);
        setEditingSlide(null);
        form.resetFields();
        setFileList([]);
    };

    const openEditModal = (record) => {
        setIsModalOpen(true);
        setEditingSlide(record);
        form.setFieldsValue({
            index: record.index,
            link: record.link,
            description: record.description,
        });
        setFileList([
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: record.imageUrl,
            },
        ]);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSlide(null);
        form.resetFields();
        setFileList([]);
    };

    const handleSaveSlide = async (values) => {
        const image = fileList?.[0];

        const slideData = {
            index: values.index,
            link: values.link,
            description: values.description,
        };

        setIsSubmitting(true);

        try {
            if (editingSlide) {
                const response = await updateSlide(editingSlide.id, slideData, image);
                if (response.status === 200) {
                    const { message, data } = response.data.data;
                    messageApi.success(message);
                    setEntityData((prev) => prev.map((item) => (item.id === editingSlide.id ? data : item)));
                    handleCancel();
                }
            } else {
                if (!image) {
                    messageApi.error('Vui lòng chọn ảnh slide!');
                    return;
                }
                const response = await createSlide(slideData, image);
                if (response.status === 201) {
                    const { message, data } = response.data.data;
                    messageApi.success(message);
                    setEntityData((prev) => [...prev, data]);
                    handleCancel();
                }
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Có lỗi xảy ra khi thêm slide.';
            messageApi.error(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEntity = async (id) => {
        try {
            const response = await deleteSlide(id);
            if (response.status === 200) {
                setEntityData((prev) => prev.filter((a) => a.id !== id));

                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa.';
            messageApi.error(errorMessage);
        }
    };

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getSlides();
                const { data } = response.data;
                setEntityData(data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, []);

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            align: 'center',
            render: (text) => (
                <Image src={text} alt="review" width={200} preview={{ mask: 'Xem ảnh' }} className="rounded-2" />
            ),
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'link',
            key: 'link',
            render: (text) => (
                <div style={{ maxWidth: 300 }}>
                    <Tooltip title={text}>
                        <span className="text-truncate-2">{text}</span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <div style={{ maxWidth: 300 }}>
                    <Tooltip title={text}>
                        <span className="text-truncate-2">{text}</span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Số thứ tự hiển thị',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<MdOutlineModeEdit />} onClick={() => openEditModal(record)} />
                    <Popconfirm
                        title="Thông báo"
                        description={'Bạn có chắc muốn xóa slide này không?'}
                        onConfirm={() => handleDeleteEntity(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<FaRegTrashAlt />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (errorMessage) {
        return <Alert message="Lỗi" description={errorMessage} type="error" />;
    }

    return (
        <div>
            {contextHolder}

            <Modal
                title={editingSlide ? 'Cập nhật Slide' : 'Thêm mới Slide'}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText={editingSlide ? 'Cập nhật' : 'Lưu'}
                cancelText="Hủy"
                confirmLoading={isSubmitting}
            >
                <Form form={form} layout="vertical" onFinish={handleSaveSlide}>
                    <Form.Item label="Ảnh Slide">
                        <ImgCrop
                            rotationSlider
                            aspect={1190 / 400}
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
                    </Form.Item>

                    <Form.Item
                        label="Số thứ tự hiển thị"
                        name="index"
                        rules={[{ required: true, message: 'Vui lòng nhập số thứ tự!' }]}
                    >
                        <InputNumber min={1} className="w-100" />
                    </Form.Item>

                    <Form.Item
                        label="Đường dẫn"
                        name="link"
                        rules={[{ required: true, message: 'Vui lòng nhập đường dẫn!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Flex wrap justify="space-between" align="center">
                <h2>Quản lý Slide</h2>
                <Button type="primary" onClick={openCreateModal}>
                    Thêm mới
                </Button>
            </Flex>

            <Table
                bordered
                rowKey="id"
                scroll={{ x: 'max-content' }}
                dataSource={entityData}
                columns={columns}
                loading={isLoading}
                pagination={false}
            />
        </div>
    );
}

export default Slide;
