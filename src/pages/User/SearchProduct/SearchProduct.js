import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Empty, Pagination, Skeleton, Alert } from 'antd';
import Policy from '~/components/Policy';
import Product from '~/components/Product';
import { searchProducts } from '~/services/productService';
import { INITIAL_FILTERS, INITIAL_META } from '~/constants';

import classNames from 'classnames/bind';
import styles from './SearchProduct.module.scss';
import useCart from '~/hooks/useCart';

const cx = classNames.bind(styles);

function SearchProduct() {
    const { handleAddToCart, isAdding } = useCart();

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage }));
    };

    const handleChangeRowsPerPage = (current, size) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            pageSize: size,
        }));
    };

    useEffect(() => {
        if (!query) {
            navigate('/'); // nếu không có query thì về trang chủ
            return;
        }

        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await searchProducts(query, filters);
                const { meta, items } = response.data.data;
                setEntityData(items);
                setMeta(meta);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, filters]);

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

            {isLoading ? (
                <div className="row">
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="col-12 col-md-4 mb-4">
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </div>
                    ))}
                </div>
            ) : errorMessage ? (
                <div className="my-5">
                    <Alert message="Lỗi" description={errorMessage} type="error" />
                </div>
            ) : !entityData || entityData.length === 0 ? (
                <Empty description="Không tìm thấy sản phẩm nào" />
            ) : (
                <div className="row g-3">
                    <div className="col-12">
                        <div className={cx('product-wrapper')}>
                            {entityData.map((product) => (
                                <div key={product.id} className={cx('item-product')}>
                                    <Product
                                        data={product}
                                        isAdding={isAdding}
                                        onAddToCart={() => handleAddToCart(product.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-12 d-flex justify-content-center">
                        <Pagination
                            current={filters.pageNum}
                            pageSize={filters.pageSize}
                            total={meta.totalElements}
                            onChange={handleChangePage}
                            showSizeChanger={true}
                            onShowSizeChange={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            )}

            <Policy className="py-3" />
        </div>
    );
}

export default SearchProduct;
