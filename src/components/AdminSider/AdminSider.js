import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { AiFillDashboard, AiFillProduct } from 'react-icons/ai';
import { IoMdSettings } from 'react-icons/io';
import { BsNewspaper } from 'react-icons/bs';
import { FaUsers, FaHistory, FaChartBar } from 'react-icons/fa';

import images from '~/assets';
import useAuth from '~/hooks/useAuth';
import { checkUserHasRequiredRole } from '~/utils/helper';

const { Sider } = Layout;

const menuConfig = [
    {
        label: 'Trang chủ',
        key: '/admin/home',
        icon: <AiFillDashboard />,
    },
    {
        label: 'Thiết lập hệ thống',
        key: '/admin/settings',
        icon: <IoMdSettings />,
        children: [
            { label: 'Thông tin thư viện', key: '/admin/settings/library-info' },
            { label: 'Nội quy thư viện', key: '/admin/settings/library-rules' },
            { label: 'Kì nghỉ ngày lễ', key: '/admin/settings/holidays' },
            { label: 'Cấu hình chung', key: '/admin/settings/general' },
            { label: 'Thiết lập Slide', key: '/admin/settings/slider' },
        ],
    },
    {
        label: 'Quản lý người dùng',
        key: '/admin/user',
        icon: <FaUsers />,
    },
    {
        label: 'Quản lý sản phẩm',
        key: 'product-management',
        icon: <AiFillProduct />,
        children: [
            { label: 'Danh sách sản phẩm', key: '/admin/products' },
            { label: 'Thuộc tính sản phẩm', key: '/admin/attributes' },
            { label: 'Danh mục sản phẩm', key: '/admin/categories' },
        ],
    },
    {
        label: 'Quản lý đơn hàng',
        key: '/admin/orders',
        icon: <FaChartBar />,
        children: [{ label: 'Báo cáo', key: '/admin/reports/statistics' }],
    },
    {
        label: 'Thống kê báo cáo',
        key: '/admin/reports',
        icon: <FaChartBar />,
        children: [{ label: 'Báo cáo', key: '/admin/reports/statistics2' }],
    },
    {
        label: 'Quản lý tin tức',
        key: 'news-management',
        icon: <BsNewspaper />,
        children: [
            { label: 'Danh sách tin tức', key: '/admin/news' },
            { label: 'Danh mục tin tức', key: '/admin/news-categories' },
        ],
    },
    {
        label: 'Lịch sử truy cập',
        key: '/admin/histories',
        icon: <FaHistory />,
    },
];

const filterMenuItems = (items, roleNames) => {
    return items
        .map((item) => {
            if (item.roles && !item.roles.some((role) => checkUserHasRequiredRole(roleNames, role))) return null;

            const filteredItem = { ...item };
            if (filteredItem.children) {
                filteredItem.children = filterMenuItems(filteredItem.children, roleNames);
            }

            return filteredItem;
        })
        .filter(Boolean);
};

function AdminSider() {
    const {
        user: { roleNames },
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const handleMenuItemClick = ({ key }) => {
        navigate(key);
    };

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    const menuItems = useMemo(() => filterMenuItems(menuConfig, roleNames), [roleNames]);

    return (
        <Sider collapsible width={220} collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="text-center py-2">
                <Link to="/" className="d-block">
                    <img src={collapsed ? images.logoSmall : images.logo} alt="logo" width={collapsed ? 30 : 200} />
                </Link>
            </div>
            <Menu
                theme="dark"
                selectedKeys={[selectedKey]}
                mode="inline"
                items={menuItems}
                onClick={handleMenuItemClick}
            />
        </Sider>
    );
}

export default AdminSider;
