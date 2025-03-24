import { BrowserRouter, Route, Routes } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';

import RequireAuth from './routes/RequireAuth';

import { ROLES } from './constants/roleConstants';
import { ROUTES } from './constants/routes';

import Home from './pages/User/Home';
import Login from './pages/User/Login';
import ForgotPassword from './pages/User/ForgotPassword';
import Register from './pages/User/Register';

import Cart from './pages/User/Cart';

import Dashboard from './pages/Admin/Dashboard';
import AdminLogin from './pages/Admin/Login';
import AdminForgotPassword from './pages/Admin/ForgotPassword';
import Category from './pages/Admin/Category';

import AccessDenied from './pages/common/AccessDenied';
import NotFound from './pages/common/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />

                    {/* Đường dẫn yêu cầu đăng nhập */}
                    <Route element={<RequireAuth />}>
                        <Route path={ROUTES.CART} element={<Cart />} />
                    </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
                    {/* Đường dẫn yêu cầu quyền quản trị */}
                    <Route path="admin/" element={<AdminLayout />}>
                        {/* Trang chủ */}
                        <Route index element={<Dashboard />} />
                        <Route path="home" element={<Dashboard />} />

                        {/* Quản lý sản phẩm */}

                        <Route path="categories" element={<Category />} />
                    </Route>
                </Route>

                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="admin/forgot-password" element={<AdminForgotPassword />} />

                <Route path="access-denied" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
