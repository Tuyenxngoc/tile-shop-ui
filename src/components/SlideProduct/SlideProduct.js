import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import Swal from 'sweetalert2';
import Product from '../Product';
import { FaCaretRight } from 'react-icons/fa';

import classNames from 'classnames/bind';
import styles from './SlideProduct.module.scss';

const cx = classNames.bind(styles);

const products = [
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
];

const brands = [
    {
        name: 'Grohe',
        url: '/bon-cau-grohe',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/Logo-thuonghieu/Grohe_w0_h0_n.png',
    },
    {
        name: 'American Standard',
        url: '/bon-cau-american-standard',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/Logo-thuonghieu/AS_w0_h0_n.png',
    },
    {
        name: 'DeMuhler',
        url: '/bon-cau-demuhler',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/Logo-thuonghieu/DeMuhler_w0_h0_n.png',
    },
    {
        name: 'Inax',
        url: '/bon-cau-inax',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/Logo-thuonghieu/Inax_w0_h0_n.png',
    },
    {
        name: 'Toto',
        url: '/bon-cau-toto',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/Logo-thuonghieu/TOTO_w0_h0_n.png',
    },
];

function SlideProduct() {
    const handleAddToCart = () => {
        Swal.fire({
            title: 'Thành công!',
            text: 'Sản phẩm đã được thêm vào giỏ hàng.',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    return (
        <div className="container pb-3">
            <div className={cx('wrapper')}>
                <div className="row mb-4">
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

                <div className="row">
                    <div className="col col-12">
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
                            {products.map((product, index) => (
                                <SwiperSlide key={index}>
                                    <Product data={product} onAddToCart={handleAddToCart} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlideProduct;
