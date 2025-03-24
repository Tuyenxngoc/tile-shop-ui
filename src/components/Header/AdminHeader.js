import { Layout, Dropdown, Space, Flex } from 'antd';
import { FaAngleDown } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import useAuth from '~/hooks/useAuth';

const { Header } = Layout;

function AdminHeader({ colorBgContainer }) {
    const {
        user: { username },
        logout,
    } = useAuth();

    const adminActionItems = [
        {
            key: '1',
            label: 'Đăng xuất',
            icon: <IoIosLogOut />,
            onClick: logout,
        },
    ];

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
            className="shadow-sm"
        >
            <Flex justify="end" align="center" gap={24} style={{ margin: '0 16px' }}>
                <Dropdown menu={{ items: adminActionItems }}>
                    <Space>
                        Xin chào <b>{username}</b>
                        <FaAngleDown />
                    </Space>
                </Dropdown>
            </Flex>
        </Header>
    );
}

export default AdminHeader;
