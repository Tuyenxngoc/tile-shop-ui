import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import Swal from 'sweetalert2';
import { FaCaretRight } from 'react-icons/fa';

import classNames from 'classnames/bind';
import styles from './SlideProduct.module.scss';

import Product from '../Product';
import { getProductsForUser } from '~/services/productService';
import { Alert, Spin } from 'antd';
import { addToCart } from '~/services/cartService';
import { getBrands } from '~/services/brandService';

const cx = classNames.bind(styles);

function SlideProduct() {
    const [brands, setBrands] = useState([]);
    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

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
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const [productsRes, brandsRes] = await Promise.all([getProductsForUser(), getBrands()]);

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
        <div className="container pb-3">
            <div className={cx('wrapper')}>
                <div className="row mx-0 mb-4">
                    <div className="col col-md-5 col-8">
                        <h2 className={cx('title-popup')}>Bồn Cầu</h2>
                    </div>

                    <div className="col col-md-7 col-4 text-end">
                        {brands.map((brand, index) => (
                            <a key={index} href={brand.url} className={cx('btn-brand')}>
                                <img src={brand.img} alt={brand.name} width={100} className="img-fluid" />
                            </a>
                        ))}
                        <a className={cx('btn-brand', 'btn-read-more')} href="/bon-cau">
                            <span>Xem tất cả</span>
                            <FaCaretRight />
                        </a>
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
                        ) : (
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
                                        <Product data={product} onAddToCart={() => handleAddToCart(product.id)} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlideProduct;
