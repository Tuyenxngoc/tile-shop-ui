import { Typography, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FiMail, FiPhone, FiKey, FiUser } from 'react-icons/fi';
import useAuth from '~/hooks/useAuth';

const { Title, Text } = Typography;

function UserProfile() {
    const { user } = useAuth();

    return (
        <section>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <Title level={3} className="mb-0">
                    Thông tin cá nhân
                </Title>
                <Button type="link" icon={<EditOutlined />} className="text-secondary">
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
                                {user.fullName} ({user.gender === 'MALE' ? 'Nam' : 'Nữ'})
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
