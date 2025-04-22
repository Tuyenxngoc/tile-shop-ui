import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, LockOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';

const menuItems = [
    {
        key: '/ho-so',
        icon: <UserOutlined />,
        label: (
            <NavLink to="/ho-so" className="text-decoration-none">
                Thông tin cá nhân
            </NavLink>
        ),
    },
    {
        key: '/ho-so/don-hang',
        icon: <ShoppingCartOutlined />,
        label: (
            <NavLink to="/ho-so/don-hang" className="text-decoration-none">
                Lịch sử mua hàng
            </NavLink>
        ),
    },
    {
        key: '/ho-so/doi-mat-khau',
        icon: <LockOutlined />,
        label: (
            <NavLink to="/ho-so/doi-mat-khau" className="text-decoration-none">
                Đổi mật khẩu
            </NavLink>
        ),
    },
];

function ProfileLayout() {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    return (
        <div className="container py-4">
            <div className="row">
                <aside className="col-md-3 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Tài khoản</h5>
                            <Menu mode="inline" selectedKeys={[selectedKey]} items={menuItems} className="border-0" />
                        </div>
                    </div>
                </aside>

                <main className="col-md-9">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ProfileLayout;
