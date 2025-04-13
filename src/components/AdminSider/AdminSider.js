import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { AiFillDashboard } from 'react-icons/ai';
import { IoMdSettings } from 'react-icons/io';
import { BsNewspaper } from 'react-icons/bs';
import { FaUsers, FaChartBar, FaShoppingCart } from 'react-icons/fa';

import images from '~/assets';
import useAuth from '~/hooks/useAuth';
import { checkUserHasRequiredRole } from '~/utils/helper';
import { FaBoxOpen } from 'react-icons/fa6';

const { Sider } = Layout;

const menuConfig = [
    {
        label: 'Trang chủ',
        key: '/admin/home',
        icon: <AiFillDashboard />,
    },
    {
        label: 'Thiết lập hệ thống',
        key: 'system-settings',
        icon: <IoMdSettings />,
        children: [
            { label: 'Thông tin cửa hàng', key: '/admin/system-settings/store-info' },
            { label: 'Cấu hình chung', key: '/admin/system-settings/general' },
            { label: 'Thiết lập Slide', key: '/admin/system-settings/slider' },
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
        icon: <FaBoxOpen />,
        children: [
            { label: 'Danh sách sản phẩm', key: '/admin/products' },
            { label: 'Thuộc tính sản phẩm', key: '/admin/attributes' },
            { label: 'Danh mục sản phẩm', key: '/admin/categories' },
            { label: 'Thương hiệu sản phẩm', key: '/admin/brands' },
            { label: 'Đánh giá sản phẩm', key: '/admin/reviews' },
        ],
    },
    {
        label: 'Quản lý đơn hàng',
        key: '/admin/orders',
        icon: <FaShoppingCart />,
        children: [{ label: 'Báo cáo', key: '/admin/reports/statistics' }],
    },
    {
        label: 'Thống kê & Báo cáo',
        key: '/admin/statistics',
        icon: <FaChartBar />,
        children: [{ label: 'Báo cáo tổng hợp', key: '/admin/statistics/overview' }],
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
