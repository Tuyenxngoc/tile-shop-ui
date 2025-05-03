import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Spin, Empty } from 'antd';
import Policy from '~/components/Policy';
import { searchProducts } from '~/services/productService';
import Product from '~/components/Product';
import { addToCart } from '~/services/cartService';
import Swal from 'sweetalert2';
function SearchProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const handleAddToCart = async (productId) => {
        try {
            const payload = {
                productId,
                quantity: 1,
            };

            await addToCart(payload);

            Swal.fire({
                title: 'Thành công!',
                text: 'Sản phẩm đã được thêm vào giỏ hàng.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.log(error);

            Swal.fire({
                title: 'Thất bại!',
                text: error.response?.data?.message || 'Không thể thêm vào giỏ hàng.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    useEffect(() => {
        if (!query) {
            navigate('/'); // nếu không có query thì về trang chủ
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await searchProducts(query);
                const { items } = response.data.data;
                setProducts(items);
            } catch (error) {
                console.error('Lỗi tìm kiếm sản phẩm:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query, navigate]);

    return (
        <div className="container bg-white">
            <Breadcrumb
                className="py-4"
                separator=">"
                itemRender={(route) => {
                    if (route.to) {
                        return <Link to={route.to}>{route.title}</Link>;
                    }
                    return <span>{route.title}</span>;
                }}
                items={[{ title: 'Trang chủ', to: '/' }, { title: 'Tìm kiếm' }]}
            />

            <h5 className="pb-3">
                Kết quả tìm kiếm cho: <strong>{query}</strong>
            </h5>

            {loading ? (
                <div className="text-center my-5">
                    <Spin tip="Đang tìm kiếm..." />
                </div>
            ) : products.length === 0 ? (
                <Empty description="Không tìm thấy sản phẩm nào" />
            ) : (
                <div className="row">
                    {products.map((product) => (
                        <div key={product.id} className="col-6 col-md-3">
                            <Product data={product} onAddToCart={() => handleAddToCart(product.id)} />
                        </div>
                    ))}
                </div>
            )}

            <Policy />
        </div>
    );
}

export default SearchProduct;
