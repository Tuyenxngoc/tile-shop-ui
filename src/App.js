import { BrowserRouter, Route, Routes } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';
import ProfileLayout from './layouts/ProfileLayout';

import RequireAuth from './routes/RequireAuth';

import { ROLES } from './constants/roleConstants';
import { ROUTES } from './constants/routes';

import ScrollToTop from './components/ScrollToTop';

import Home from './pages/User/Home';
import Login from './pages/User/Login';
import ForgotPassword from './pages/User/ForgotPassword';
import Register from './pages/User/Register';
import SearchProduct from './pages/User/SearchProduct';
import ProductDetail from './pages/User/ProductDetail';
import ProductByCategory from './pages/User/ProductByCategory';
import ProductByBrand from './pages/User/ProductByBrand';
import Checkout from './pages/User/Checkout';
import PaymentReturn from './pages/User/PaymentReturn';
import UserProfile from './pages/User/UserProfile';
import Orders from './pages/User/Orders';
import OrdersDetail from './pages/User/OrdersDetail';
import ChangePassword from './pages/User/ChangePassword';
import NewsDetail from './pages/User/NewsDetail';
import NewsList from './pages/User/NewsList';
import Cart from './pages/User/Cart';

import AccessDenied from './pages/Common/AccessDenied';
import NotFound from './pages/Common/NotFound';

import Dashboard from './pages/Admin/Dashboard';
import SalesOverview from './pages/Admin/SalesOverview';
import AdminLogin from './pages/Admin/Login';
import AdminForgotPassword from './pages/Admin/ForgotPassword';

import Category from './pages/Admin/Category';
import CategoryForm from './pages/Admin/Category/CategoryForm';

import Attribute from './pages/Admin/Attribute';

import News from './pages/Admin/News';
import NewsForm from './pages/Admin/News/NewsForm';

import NewsCategory from './pages/Admin/NewsCategory';

import Product from './pages/Admin/Product';
import ProductForm from './pages/Admin/Product/ProductForm';

import Brand from './pages/Admin/Brand';
import BrandForm from './pages/Admin/Brand/BrandForm';

import Review from './pages/Admin/Review';

import User from './pages/Admin/User';
import CreateUserForm from './pages/Admin/User/CreateUserForm';
import UpdateUserForm from './pages/Admin/User/UpdateUserForm';

import Order from './pages/Admin/Order';
import OrderEdit from './pages/Admin/Order/OrderEdit';

import StoreInfo from './pages/Admin/StoreInfo';
import General from './pages/Admin/General';
import Slide from './pages/Admin/Slide';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />

                    <Route path="tim-kiem" element={<SearchProduct />} />
                    <Route path="san-pham/:id" element={<ProductDetail />} />
                    <Route path="danh-muc/:id" element={<ProductByCategory />} />
                    <Route path="thuong-hieu/:id" element={<ProductByBrand />} />

                    <Route path="tin-tuc" element={<NewsList />} />
                    <Route path="tin-tuc/:id" element={<NewsDetail />} />

                    {/* Đường dẫn yêu cầu đăng nhập */}
                    <Route element={<RequireAuth />}>
                        <Route path={ROUTES.CART} element={<Cart />} />
                        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
                        <Route path={ROUTES.CHECKOUT_RESULT} element={<PaymentReturn />} />

                        <Route path="ho-so" element={<ProfileLayout />}>
                            <Route index element={<UserProfile />} />

                            <Route path="don-hang">
                                <Route index element={<Orders />} />
                                <Route path=":id" element={<OrdersDetail />} />
                            </Route>

                            <Route path="doi-mat-khau" element={<ChangePassword />} />
                        </Route>
                    </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
                    {/* Đường dẫn yêu cầu quyền quản trị */}
                    <Route path="admin/" element={<AdminLayout />}>
                        {/* Trang chủ */}
                        <Route index element={<Dashboard />} />
                        <Route path="home" element={<Dashboard />} />

                        {/* Xem thống kê */}
                        <Route path="statistics/overview" element={<SalesOverview />} />

                        {/* Quản lý danh mục */}
                        <Route path="categories">
                            <Route index element={<Category />} />
                            <Route path="new" element={<CategoryForm />} />
                            <Route path="edit/:id" element={<CategoryForm />} />
                        </Route>

                        {/* Quản lý sản phẩm */}
                        <Route path="products">
                            <Route index element={<Product />} />
                            <Route path="new" element={<ProductForm />} />
                            <Route path="edit/:id" element={<ProductForm />} />
                        </Route>

                        {/* Quản lý người dùng */}
                        <Route path="users">
                            <Route index element={<User />} />
                            <Route path="new" element={<CreateUserForm />} />
                            <Route path="edit/:id" element={<UpdateUserForm />} />
                        </Route>

                        {/* Quản lý đánh giá */}
                        <Route path="reviews">
                            <Route index element={<Review />} />
                        </Route>

                        {/* Quản lý đơn hàng */}
                        <Route path="orders">
                            <Route index element={<Order />} />
                            <Route path="edit/:id" element={<OrderEdit />} />
                        </Route>

                        {/* Quản lý thuộc tính */}
                        <Route path="attributes">
                            <Route index element={<Attribute />} />
                        </Route>

                        {/* Quản lý tin tức */}
                        <Route path="news">
                            <Route index element={<News />} />
                            <Route path="new" element={<NewsForm />} />
                            <Route path="edit/:id" element={<NewsForm />} />
                        </Route>

                        {/* Quản lý thương hiệu */}
                        <Route path="brands">
                            <Route index element={<Brand />} />
                            <Route path="new" element={<BrandForm />} />
                            <Route path="edit/:id" element={<BrandForm />} />
                        </Route>

                        {/* Quản lý loại tin tức */}
                        <Route path="news-categories">
                            <Route index element={<NewsCategory />} />
                        </Route>

                        {/* Thiết lập hệ thống */}
                        <Route path="system-settings">
                            <Route path="store-info" element={<StoreInfo />} />
                            <Route path="general" element={<General />} />
                            <Route path="slider" element={<Slide />} />
                        </Route>
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
