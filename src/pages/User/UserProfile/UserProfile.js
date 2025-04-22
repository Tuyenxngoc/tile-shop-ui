import { useState } from 'react';
import { Typography, Button, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FiMail, FiPhone, FiKey, FiUser } from 'react-icons/fi';
import useAuth from '~/hooks/useAuth';
import { updateMyProfile } from '~/services/userService';

const { Title, Text } = Typography;
const { Option } = Select;

function UserProfile() {
    const { user, updateUserInfo } = useAuth();

    const [messageApi, contextHolder] = message.useMessage();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = () => {
        form.setFieldsValue({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
        });
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await updateMyProfile(values);
            const { message: msg, data } = response.data.data;

            messageApi.success(msg);
            updateUserInfo(data);

            setIsModalOpen(false);
        } catch (err) {
            messageApi.error('Vui lòng kiểm tra lại thông tin.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <section>
            {contextHolder}

            <Modal
                title="Chỉnh sửa thông tin"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên' },
                            {
                                pattern: /^\S+(\s+\S+)+$/,
                                message: 'Họ và tên phải có ít nhất hai từ',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email' }]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            {
                                pattern: /^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/,
                                message: 'Số điện thoại không hợp lệ',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="address" label="Địa chỉ">
                        <Input autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                        <Select>
                            <Option value="MALE">Nam</Option>
                            <Option value="FEMALE">Nữ</Option>
                            <Option value="OTHER">Khác</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <Title level={3} className="mb-0">
                    Thông tin cá nhân
                </Title>
                <Button type="link" icon={<EditOutlined />} className="text-secondary" onClick={handleEdit}>
                    Sửa
                </Button>
            </div>
            <div className="row mt-4 g-3">
                <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded custom-info-box">
                        <FiUser className="me-3 fs-4 text-secondary" />
                        <div>
                            <Text className="d-block text-muted">Họ tên</Text>

                            <Text>
                                {user.fullName || user.username} ({user.gender === 'MALE' ? 'Nam' : 'Nữ'})
                            </Text>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded custom-info-box">
                        <FiMail className="me-3 fs-4 text-secondary" />
                        <div>
                            <Text className="d-block text-muted">Địa chỉ email</Text>
                            <Text>{user.email}</Text>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded custom-info-box">
                        <FiPhone className="me-3 fs-4 text-secondary" />
                        <div>
                            <Text className="d-block text-muted">Số điện thoại</Text>
                            <Text>{user.phoneNumber}</Text>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded custom-info-box">
                        <FiKey className="me-3 fs-4 text-secondary" />
                        <div>
                            <Text className="d-block text-muted">Mật khẩu</Text>
                            <Text>•••••••••••••••••••••</Text>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UserProfile;
