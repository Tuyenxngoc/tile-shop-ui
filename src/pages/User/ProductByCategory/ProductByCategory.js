import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Breadcrumb, Empty, Pagination, Skeleton, Button, Dropdown, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, PercentageOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons';

import classNames from 'classnames/bind';
import styles from './ProductByCategory.module.scss';

import ReactQuill from 'react-quill';
import Product from '~/components/Product';
import { getProducts } from '~/services/productService';
import { getCategoryBySlug } from '~/services/categoryService';
import { INITIAL_FILTERS, INITIAL_META } from '~/constants';
import useCart from '~/hooks/useCart';

const cx = classNames.bind(styles);

function ProductByCategory() {
    const { handleAddToCart, isAdding } = useCart();

    const { id } = useParams();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [category, setCategory] = useState({});

    const [products, setProducts] = useState([]);
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

    const handlePriceFilterChange = ({ key }) => {
        let minPrice, maxPrice;

        switch (key) {
            case '2-7':
                minPrice = 2000000;
                maxPrice = 7000000;
                break;
            case '7-12':
                minPrice = 7000000;
                maxPrice = 12000000;
                break;
            case '12-20':
                minPrice = 12000000;
                maxPrice = 20000000;
                break;
            case '20+':
                minPrice = 20000000;
                maxPrice = undefined; // Không giới hạn trên
                break;
            default:
                minPrice = undefined;
                maxPrice = undefined;
        }

        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            minPrice,
            maxPrice,
        }));
    };

    const handleSortChange = (sortType) => {
        let sortBy, isAscending;

        switch (sortType) {
            case 'price-desc':
                sortBy = 'price';
                isAscending = false;
                break;
            case 'price-asc':
                sortBy = 'price';
                isAscending = true;
                break;
            case 'promotion':
                sortBy = 'discountPercentage';
                isAscending = false;
                break;
            case 'view-desc':
                sortBy = 'viewCount';
                isAscending = false;
                break;
            case 'rating-desc':
                sortBy = 'averageRating';
                isAscending = false;
                break;
            default:
                sortBy = undefined;
                isAscending = undefined;
        }

        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            sortBy,
            isAscending,
        }));
    };

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
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getProducts({ searchBy: 'categorySlug', keyword: id, ...filters });
                const { meta, items } = response.data.data;
                setProducts(items);
                setMeta(meta);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [filters, id]);

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
                    ...(category.parent
                        ? [{ title: category.parent.name, to: `/danh-muc/${category.parent.slug}` }]
                        : []),
                    { title: category.name },
                ]}
            />

            <div className="bg-white p-4 rounded shadow-sm mb-3">
                <div className="mb-3">
                    <strong>Chọn theo tiêu chí</strong>
                </div>
                <Dropdown
                    className="mb-4"
                    menu={{
                        items: [
                            { label: 'Từ 2tr - 7tr', key: '2-7' },
                            { label: 'Từ 7tr - 12tr', key: '7-12' },
                            { label: 'Từ 12tr - 20tr', key: '12-20' },
                            { label: 'Trên 20tr', key: '20+' },
                        ],
                        onClick: handlePriceFilterChange,
                    }}
                >
                    <Button>Giá</Button>
                </Dropdown>

                <div className="mb-3">
                    <strong>Sắp xếp theo</strong>
                </div>

                <Space wrap className="mb-4">
                    <Button type="default" icon={<ArrowUpOutlined />} onClick={() => handleSortChange('price-desc')}>
                        Giá cao
                    </Button>

                    <Button type="default" icon={<ArrowDownOutlined />} onClick={() => handleSortChange('price-asc')}>
                        Giá thấp
                    </Button>

                    <Button type="default" icon={<PercentageOutlined />} onClick={() => handleSortChange('promotion')}>
                        Khuyến mại
                    </Button>

                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleSortChange('view-desc')}>
                        Xem nhiều
                    </Button>

                    <Button type="default" icon={<StarOutlined />} onClick={() => handleSortChange('rating-desc')}>
                        Đánh giá
                    </Button>
                </Space>

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
                ) : !products || products.length === 0 ? (
                    <Empty description="Không tìm thấy sản phẩm nào" />
                ) : (
                    <div className="row g-3">
                        <div className="col-12">
                            <div className={cx('product-wrapper')}>
                                {products.map((product) => (
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
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
                <div className="row">
                    <div className="col-12">
                        <ReactQuill value={category.description} readOnly={true} theme="bubble" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductByCategory;
