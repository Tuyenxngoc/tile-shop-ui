import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Product from '~/components/Product';
import { getCategoryBySlug } from '~/services/categoryService';
import { getProducts } from '~/services/productService';

import classNames from 'classnames/bind';
import styles from './ProductByCategory.module.scss';

const cx = classNames.bind(styles);

function ProductByCategory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);

    //Tải dữ liệu
    useEffect(() => {
        const fetchEntity = async () => {
            try {
                const response = await getCategoryBySlug(id);
                setCategory(response.data.data);
            } catch (error) {}
        };

        fetchEntity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts({ categorySlug: id });
                const { items } = response.data.data;
                setProducts(items);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, [id]);

    return (
        <div className="container">
            <Breadcrumb
                className="py-4"
                separator=">"
                itemRender={(route) => {
                    if (route.to) {
                        return <Link to={route.to}>{route.title}</Link>;
                    }
                    return <span>{route.title}</span>;
                }}
                items={[
                    { title: 'Trang chủ', to: '/' },
                    { title: 'Giỏ hàng', to: '/gio-hang' },
                    { title: 'Thanh toán' },
                ]}
            />

            <div className="bg-white p-4 rounded shadow-sm mb-3">
                <div className="row">
                    <div className="col-12">1212</div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm mb-3">
                <div className="row">
                    <div className="col-12">
                        <div className={cx('product-wrapper')}>
                            {products.map((product) => (
                                <div key={product.id} className={cx('item-product')}>
                                    <Product data={product} onAddToCart={() => alert(1)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
                <div className="row">
                    <div className="col-12">
                        <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: category.description }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductByCategory;
