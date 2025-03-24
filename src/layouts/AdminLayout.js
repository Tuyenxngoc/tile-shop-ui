import { Outlet } from 'react-router-dom';

import { Layout, theme } from 'antd';
import AdminFooter from '~/components/Footer/AdminFooter';
import AdminHeader from '~/components/Header/AdminHeader';
import AdminSider from '~/components/AdminSider';

const { Content } = Layout;

function AdminLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminSider />

            <Layout>
                <AdminHeader colorBgContainer={colorBgContainer} />

                <Content style={{ margin: '16px' }}>
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
                </Content>

                <AdminFooter />
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
