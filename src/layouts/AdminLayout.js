import { Outlet, useLocation } from 'react-router-dom';

import { Layout, theme } from 'antd';
import AdminFooter from '~/components/Footer/AdminFooter';
import AdminHeader from '~/components/Header/AdminHeader';
import AdminSider from '~/components/AdminSider';
import { useMemo } from 'react';

const { Content } = Layout;

const noWrapperRegexes = [
    /^\/admin\/products\/new$/, // exact match "/admin/products/new"
    /^\/admin\/products\/edit\/[^/]+$/, // matches "/admin/products/edit/:id",
    /^\/admin\/reviews$/, // exact match "/admin/reviews"
];

function pathMatchesAnyRegex(path, regexes) {
    return regexes.some((regex) => regex.test(path));
}

function AdminLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();

    const shouldWrap = useMemo(() => !pathMatchesAnyRegex(location.pathname, noWrapperRegexes), [location.pathname]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminSider />

            <Layout>
                <AdminHeader colorBgContainer={colorBgContainer} />

                <Content style={{ margin: '16px' }}>
                    {shouldWrap ? (
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Outlet />
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </Content>

                <AdminFooter />
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
