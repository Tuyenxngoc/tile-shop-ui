import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import { FaCaretRight } from 'react-icons/fa';

import classNames from 'classnames/bind';
import styles from './SlideProduct.module.scss';

import Product from '../Product';
import { Alert, Empty, Spin } from 'antd';
import useCart from '~/hooks/useCart';

const cx = classNames.bind(styles);

function SlideProduct({
    className,
    title,
    fetchProducts,
    productFilterParams,
    fetchBrands,
    brandFilterParams,
    viewAllLink,
}) {
    const { handleAddToCart, isAdding } = useCart();

    const [brands, setBrands] = useState([]);
    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const [productsRes, brandsRes] = await Promise.all([
                    fetchProducts(productFilterParams),
                    fetchBrands(brandFilterParams),
                ]);

                const { items: productItems } = productsRes.data.data;
                setEntityData(productItems);

                const { items: brandItems } = brandsRes.data.data;
                setBrands(brandItems);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, []);

    return (
        <div className={cx('wrapper', className)}>
            <div className="row mx-0 mb-4">
                <div className="col-12 col-md-3">
                    <h2 className={cx('title')}>{title}</h2>
                </div>

                <div className="col-12 col-md-9">
                    <div className="d-flex align-items-center justify-content-end">
                        {brands.map((brand, index) => (
                            <Link key={index} to={`thuong-hieu/${brand.slug}`} className={cx('btn-brand')}>
                                {brand.logoUrl ? (
                                    <img src={brand.logoUrl} alt={brand.name} width={100} className="img-fluid" />
                                ) : (
                                    <span className={cx('brand-placeholder')}>{brand.name}</span>
                                )}
                            </Link>
                        ))}
                        <Link to={viewAllLink} className={cx('btn-brand')}>
                            <span className={cx('brand-placeholder')}>
                                Xem tất cả <FaCaretRight />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row mx-0">
                <div className="col col-12">
                    {isLoading ? (
                        <div className="d-flex justify-content-center w-100">
                            <Spin size="large" />
                        </div>
                    ) : errorMessage ? (
                        <div className="w-100">
                            <Alert message="Lỗi" description={errorMessage} type="error" />
                        </div>
                    ) : entityData && entityData.length > 0 ? (
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#333',
                                '--swiper-pagination-color': '#333',
                            }}
                            modules={[Navigation, Grid]}
                            navigation
                            spaceBetween={10}
                            slidesPerView={5}
                            grid={{ rows: 2, fill: 'row' }}
                        >
                            {entityData.map((product, index) => (
                                <SwiperSlide key={index}>
                                    <Product
                                        data={product}
                                        isAdding={isAdding}
                                        onAddToCart={() => handleAddToCart(product.id)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="d-flex justify-content-center w-100 py-5">
                            <Empty description="Không có sản phẩm nào để hiển thị." />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SlideProduct;
