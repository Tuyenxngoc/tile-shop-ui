import { Breadcrumb, Rate } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FaShoppingBag } from 'react-icons/fa';

import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import './swiper-custom.scss';
import { Link } from 'react-router-dom';
import images from '~/assets';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

const cx = classNames.bind(styles);

const imagesMtt = [
    'https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/demuhler/ML366304.jpg',
    'https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/demuhler/ML366304-1.jpg',
    'https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/demuhler/ML366304-2.jpg',
    'https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/demuhler/ML366304-3.jpg',
    'https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/demuhler/ML366304-4.jpg',
    'https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/demuhler/ML366304-5.jpg',
    'https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/demuhler/ML366304-6.jpg',
];

const datta =
    '<h1>Thông tin sản phẩm</h1><p>Đây là thông tin chi tiết về sản phẩm Bồn cầu thường đặt sàn DeMuhler ML366304.</p>';

function ProductDetail() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const [showMore, setShowMore] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            setIsOverflowing(contentRef.current.scrollHeight > 600);
        }
    }, []);

    return (
        <div className="container">
            <Breadcrumb
                className="py-4"
                separator=">"
                items={[
                    {
                        title: 'Home',
                    },
                    {
                        title: 'Application Center',
                        href: '',
                    },
                    {
                        title: 'Application List',
                        href: '',
                    },
                    {
                        title: 'An Application',
                    },
                ]}
            />

            <div className={cx('wrapper')}>
                <div className="row mx-0">
                    <div className="col-12 col-md-6">
                        <div className="product-images">
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#333',
                                    '--swiper-pagination-color': '#333',
                                }}
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2"
                            >
                                {imagesMtt.map((src, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={src} alt={`Slide ${index + 1}`} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {imagesMtt.map((src, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={src} alt={`Thumbnail ${index + 1}`} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <div>
                            <a href="https://shome.vn/he-thong-cua-hang">
                                <img
                                    src="https://nshpos.com/Web/Resources/Uploaded/18/images/Promotion/2024/T7/he-thong.jpg"
                                    title=""
                                    className="img-fluid rounded"
                                    alt="Banner dưới sản phẩm"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="row mb-3">
                            <div className="col-12">
                                <h1 className={cx('title')}>Bồn cầu thường đặt sàn DeMuhler ML366304</h1>
                            </div>
                            <div className="col-12 mb-2">
                                <span className={cx('meta')}>
                                    Thương hiệu: <strong className="text-danger">DeMuhler</strong>
                                </span>
                            </div>
                            <div className="col-12 mb-4">
                                <span className={cx('meta')}>
                                    Tình trạng: <strong className="text-danger">Liên hệ để biết thêm thông tin</strong>
                                </span>
                            </div>
                            <div className="col-12">
                                <Rate value={5} disabled />
                                <span>(5)</span>
                                <Link className={cx('comment-link')} to="#">
                                    (Xem đánh giá)
                                </Link>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12">
                                <span className={cx('sale-cost-detail')}>6,870,000₫</span> &nbsp; &nbsp; &nbsp;
                                <span className={cx('sale-public-cost-detail')}>10,570,000₫</span> &nbsp; &nbsp; &nbsp;
                                <span className={cx('meta')}>-35%</span>
                            </div>
                        </div>

                        <div className={cx('row', 'g-2', 'mb-3', 'button-group')}>
                            <div className="col col-6 text-center">
                                <button className={cx('btn', 'btn-custom', 'btn-buy-now', 'p-1')}>
                                    MUA NGAY
                                    <p className="mb-0">Giao hàng tận nơi</p>
                                </button>
                            </div>
                            <div className="col col-6 text-center">
                                <button className={cx('btn', 'btn-custom', 'btn-add-to-cart', 'p-1')}>
                                    THÊM VÀO GIỎ HÀNG
                                    <p className="mb-0">Giao hàng tận nơi</p>
                                </button>
                            </div>
                        </div>

                        <div className="row g-2 mb-3">
                            <div className="col-12">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={22}
                                        height={22}
                                        viewBox="0 0 22 22"
                                        fill="none"
                                    >
                                        <path
                                            style={{ strokeWidth: 3 }}
                                            d="M11 5.5C10.3201 5.5 9.65552 5.70161 9.09023 6.07932C8.52493 6.45704 8.08434 6.99391 7.82416 7.62203C7.56399 8.25015 7.49591 8.94131 7.62855 9.60812C7.76119 10.2749 8.08858 10.8874 8.56932 11.3682C9.05006 11.8489 9.66257 12.1763 10.3294 12.3089C10.9962 12.4416 11.6874 12.3735 12.3155 12.1133C12.9436 11.8532 13.4805 11.4126 13.8582 10.8473C14.2359 10.282 14.4375 9.61737 14.4375 8.9375C14.4375 8.02582 14.0753 7.15148 13.4307 6.50682C12.786 5.86216 11.9117 5.5 11 5.5ZM11 11C10.5921 11 10.1933 10.879 9.85414 10.6524C9.51496 10.4258 9.2506 10.1037 9.0945 9.72678C8.93839 9.34991 8.89755 8.93521 8.97713 8.53513C9.05671 8.13504 9.25315 7.76754 9.54159 7.47909C9.83004 7.19065 10.1975 6.99421 10.5976 6.91463C10.9977 6.83505 11.4124 6.87589 11.7893 7.032C12.1662 7.1881 12.4883 7.45246 12.7149 7.79164C12.9415 8.13081 13.0625 8.52958 13.0625 8.9375C13.0625 9.48451 12.8452 10.0091 12.4584 10.3959C12.0716 10.7827 11.547 11 11 11ZM11 1.375C8.995 1.37727 7.07277 2.17477 5.65502 3.59252C4.23727 5.01027 3.43977 6.9325 3.4375 8.9375C3.4375 11.6359 4.68445 14.4959 7.04688 17.209C8.10839 18.4349 9.30312 19.5389 10.609 20.5004C10.7246 20.5814 10.8623 20.6248 11.0034 20.6248C11.1446 20.6248 11.2823 20.5814 11.3979 20.5004C12.7013 19.5385 13.8938 18.4346 14.9531 17.209C17.3121 14.4959 18.5625 11.6359 18.5625 8.9375C18.5602 6.9325 17.7627 5.01027 16.345 3.59252C14.9272 2.17477 13.005 1.37727 11 1.375ZM11 19.0781C9.57945 17.9609 4.8125 13.8574 4.8125 8.9375C4.8125 7.29647 5.4644 5.72266 6.62478 4.56228C7.78516 3.4019 9.35897 2.75 11 2.75C12.641 2.75 14.2148 3.4019 15.3752 4.56228C16.5356 5.72266 17.1875 7.29647 17.1875 8.9375C17.1875 13.8557 12.4205 17.9609 11 19.0781Z"
                                            fill="#333333"
                                        />
                                    </svg>
                                    <Link to="/he-thong-cua-hang">Xem hệ thống Showroom</Link>
                                </div>
                            </div>
                            <div className="col-12">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M18.75 16.2501H17.5V9.02748C17.5 8.85448 17.4641 8.68336 17.3946 8.52494C17.3251 8.36653 17.2234 8.22427 17.0961 8.10717L10.8461 2.21029C10.843 2.20763 10.8402 2.20476 10.8375 2.2017C10.6074 1.99243 10.3075 1.87646 9.99648 1.87646C9.68545 1.87646 9.38558 1.99243 9.15547 2.2017L9.14688 2.21029L2.90391 8.10717C2.77656 8.22427 2.67491 8.36653 2.60538 8.52494C2.53586 8.68336 2.49997 8.85448 2.5 9.02748V16.2501H1.25C1.08424 16.2501 0.925268 16.316 0.808058 16.4332C0.690848 16.5504 0.625 16.7094 0.625 16.8751C0.625 17.0409 0.690848 17.1999 0.808058 17.3171C0.925268 17.4343 1.08424 17.5001 1.25 17.5001H18.75C18.9158 17.5001 19.0747 17.4343 19.1919 17.3171C19.3092 17.1999 19.375 17.0409 19.375 16.8751C19.375 16.7094 19.3092 16.5504 19.1919 16.4332C19.0747 16.316 18.9158 16.2501 18.75 16.2501ZM3.75 9.02748L3.75859 9.01967L10 3.12514L16.2422 9.01811L16.2508 9.02592V16.2501H12.5V12.5001C12.5 12.1686 12.3683 11.8507 12.1339 11.6163C11.8995 11.3818 11.5815 11.2501 11.25 11.2501H8.75C8.41848 11.2501 8.10054 11.3818 7.86612 11.6163C7.6317 11.8507 7.5 12.1686 7.5 12.5001V16.2501H3.75V9.02748ZM11.25 16.2501H8.75V12.5001H11.25V16.2501Z"
                                            fill="black"
                                        />
                                    </svg>
                                    Khảo sát - Tư vấn miễn phí
                                </div>
                            </div>
                            <div className="col-12">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={22}
                                        height={22}
                                        viewBox="0 0 22 22"
                                        fill="none"
                                    >
                                        <path
                                            d="M17.875 3.4375H4.125C3.76033 3.4375 3.41059 3.58237 3.15273 3.84023C2.89487 4.09809 2.75 4.44783 2.75 4.8125V9.86391C2.75 17.5648 9.26578 20.1197 10.5703 20.5537C10.8489 20.6484 11.1511 20.6484 11.4297 20.5537C12.7359 20.1197 19.25 17.5648 19.25 9.86391V4.8125C19.25 4.44783 19.1051 4.09809 18.8473 3.84023C18.5894 3.58237 18.2397 3.4375 17.875 3.4375ZM17.875 9.86477C17.875 16.604 12.173 18.8555 11 19.2474C9.83727 18.8598 4.125 16.61 4.125 9.86477V4.8125H17.875V9.86477ZM7.07609 12.1739C6.94709 12.0449 6.87462 11.8699 6.87462 11.6875C6.87462 11.5051 6.94709 11.3301 7.07609 11.2011C7.2051 11.0721 7.38006 10.9996 7.5625 10.9996C7.74494 10.9996 7.9199 11.0721 8.04891 11.2011L9.625 12.7772L13.9511 8.45109C14.015 8.38722 14.0908 8.33655 14.1743 8.30198C14.2577 8.26741 14.3472 8.24962 14.4375 8.24962C14.5278 8.24962 14.6173 8.26741 14.7007 8.30198C14.7842 8.33655 14.86 8.38722 14.9239 8.45109C14.9878 8.51497 15.0385 8.5908 15.073 8.67426C15.1076 8.75772 15.1254 8.84717 15.1254 8.9375C15.1254 9.02783 15.1076 9.11728 15.073 9.20074C15.0385 9.2842 14.9878 9.36003 14.9239 9.42391L10.1114 14.2364C10.0476 14.3003 9.97173 14.351 9.88827 14.3856C9.80481 14.4202 9.71535 14.438 9.625 14.438C9.53465 14.438 9.44519 14.4202 9.36173 14.3856C9.27827 14.351 9.20244 14.3003 9.13859 14.2364L7.07609 12.1739Z"
                                            fill="black"
                                        />
                                    </svg>
                                    Bảo hành chính hãng
                                </div>
                            </div>
                            <div className="col-12">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M19.3297 9.14062L18.2359 6.40625C18.1431 6.1749 17.983 5.97674 17.7763 5.83745C17.5696 5.69815 17.3258 5.62414 17.0766 5.625H14.375V5C14.375 4.83424 14.3092 4.67527 14.1919 4.55806C14.0747 4.44085 13.9158 4.375 13.75 4.375H1.875C1.54348 4.375 1.22554 4.5067 0.991117 4.74112C0.756696 4.97554 0.625 5.29348 0.625 5.625V14.375C0.625 14.7065 0.756696 15.0245 0.991117 15.2589C1.22554 15.4933 1.54348 15.625 1.875 15.625H3.20312C3.34081 16.1628 3.65356 16.6394 4.09207 16.9798C4.53057 17.3202 5.06989 17.5049 5.625 17.5049C6.18011 17.5049 6.71943 17.3202 7.15793 16.9798C7.59644 16.6394 7.90919 16.1628 8.04688 15.625H11.9531C12.0908 16.1628 12.4036 16.6394 12.8421 16.9798C13.2806 17.3202 13.8199 17.5049 14.375 17.5049C14.9301 17.5049 15.4694 17.3202 15.9079 16.9798C16.3464 16.6394 16.6592 16.1628 16.7969 15.625H18.125C18.4565 15.625 18.7745 15.4933 19.0089 15.2589C19.2433 15.0245 19.375 14.7065 19.375 14.375V9.375C19.3752 9.29468 19.3598 9.21508 19.3297 9.14062ZM14.375 6.875H17.0766L17.8266 8.75H14.375V6.875ZM1.875 5.625H13.125V10.625H1.875V5.625ZM5.625 16.25C5.37777 16.25 5.1361 16.1767 4.93054 16.0393C4.72498 15.902 4.56476 15.7068 4.47015 15.4784C4.37554 15.2499 4.35079 14.9986 4.39902 14.7561C4.44725 14.5137 4.5663 14.2909 4.74112 14.1161C4.91593 13.9413 5.13866 13.8222 5.38114 13.774C5.62361 13.7258 5.87495 13.7505 6.10335 13.8451C6.33176 13.9398 6.52699 14.1 6.66434 14.3055C6.80169 14.5111 6.875 14.7528 6.875 15C6.875 15.3315 6.7433 15.6495 6.50888 15.8839C6.27446 16.1183 5.95652 16.25 5.625 16.25ZM11.9531 14.375H8.04688C7.90919 13.8372 7.59644 13.3606 7.15793 13.0202C6.71943 12.6798 6.18011 12.4951 5.625 12.4951C5.06989 12.4951 4.53057 12.6798 4.09207 13.0202C3.65356 13.3606 3.34081 13.8372 3.20312 14.375H1.875V11.875H13.125V12.8367C12.8376 13.0028 12.586 13.2243 12.3849 13.4884C12.1837 13.7525 12.037 14.0538 11.9531 14.375ZM14.375 16.25C14.1278 16.25 13.8861 16.1767 13.6805 16.0393C13.475 15.902 13.3148 15.7068 13.2201 15.4784C13.1255 15.2499 13.1008 14.9986 13.149 14.7561C13.1972 14.5137 13.3163 14.2909 13.4911 14.1161C13.6659 13.9413 13.8887 13.8222 14.1311 13.774C14.3736 13.7258 14.6249 13.7505 14.8534 13.8451C15.0818 13.9398 15.277 14.1 15.4143 14.3055C15.5517 14.5111 15.625 14.7528 15.625 15C15.625 15.3315 15.4933 15.6495 15.2589 15.8839C15.0245 16.1183 14.7065 16.25 14.375 16.25ZM18.125 14.375H16.7969C16.6575 13.8385 16.3442 13.3635 15.9059 13.0242C15.4677 12.6849 14.9293 12.5005 14.375 12.5V10H18.125V14.375Z"
                                            fill="black"
                                        />
                                    </svg>
                                    Giao hàng toàn quốc
                                </div>
                            </div>
                            <div className="col-12">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M17.3727 12.3795L13.6922 10.7303L13.682 10.7256C13.491 10.6439 13.2825 10.6111 13.0756 10.6302C12.8687 10.6493 12.6698 10.7197 12.4969 10.835C12.4765 10.8484 12.457 10.8631 12.4383 10.8787L10.5367 12.4998C9.33204 11.9147 8.08829 10.6803 7.50313 9.49125L9.12657 7.56078C9.14219 7.54125 9.15704 7.52172 9.1711 7.50062C9.28394 7.3282 9.35239 7.13056 9.37039 6.92529C9.38838 6.72002 9.35534 6.51348 9.27423 6.32406V6.31469L7.62032 2.62797C7.51309 2.38052 7.3287 2.17438 7.09468 2.04034C6.86067 1.9063 6.58958 1.85153 6.32188 1.88422C5.26326 2.02352 4.29155 2.54341 3.58824 3.34679C2.88492 4.15017 2.49809 5.1821 2.50001 6.24984C2.50001 12.453 7.54688 17.4998 13.75 17.4998C14.8177 17.5018 15.8497 17.1149 16.6531 16.4116C17.4564 15.7083 17.9763 14.7366 18.1156 13.678C18.1484 13.4104 18.0937 13.1393 17.9598 12.9053C17.8259 12.6713 17.62 12.4869 17.3727 12.3795ZM13.75 16.2498C11.0987 16.2469 8.55687 15.1924 6.68214 13.3177C4.8074 11.443 3.7529 8.90112 3.75001 6.24984C3.74707 5.48694 4.02192 4.74906 4.52324 4.17399C5.02456 3.59892 5.71806 3.22599 6.47423 3.12484C6.47392 3.12796 6.47392 3.1311 6.47423 3.13422L8.11485 6.80609L6.50001 8.7389C6.48362 8.75776 6.46873 8.77788 6.45548 8.79906C6.33791 8.97947 6.26894 9.18718 6.25525 9.40208C6.24157 9.61697 6.28362 9.83176 6.37735 10.0256C7.08516 11.4733 8.54376 12.9209 10.007 13.628C10.2023 13.7208 10.4184 13.7614 10.634 13.7458C10.8497 13.7302 11.0576 13.6589 11.2375 13.5389C11.2576 13.5254 11.2769 13.5108 11.2953 13.4952L13.1945 11.8748L16.8664 13.5194C16.8664 13.5194 16.8727 13.5194 16.875 13.5194C16.7751 14.2766 16.4027 14.9715 15.8275 15.4741C15.2524 15.9766 14.5138 16.2524 13.75 16.2498Z"
                                            fill="black"
                                        />
                                    </svg>
                                    Hotline: <Link to="tel:0812.882.992">0812.882.992</Link> (8h00 - 21h00 mỗi ngày)
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className={cx('why-buy', 'col-md-12')}>
                                <div className={cx('icon-wrapper', 'text-white', 'text-center')}>
                                    <FaShoppingBag />
                                </div>
                                <div className={cx('content-wrapper')}>
                                    <p className={cx('headline')}>TẠI SAO MUA HÀNG Ở HÙNG HƯƠNG</p>
                                </div>
                            </div>
                        </div>

                        <div className="row g-2">
                            <div className="col-6 col-md-3">
                                <div className={cx('btn-hotline')}>
                                    <img className="img-fluid" src={images.pd1} alt="chính sách bán hàng Hung Huong" />
                                    <div className={cx('info-text')}>Cam kết giá tốt nhất</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className={cx('btn-hotline')}>
                                    <img className="img-fluid" src={images.pd3} alt="chính sách bán hàng Hung Huong" />
                                    <div className={cx('info-text')}>Bảo trì nhanh chóng</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className={cx('btn-hotline')}>
                                    <img className="img-fluid" src={images.pd5} alt="chính sách bán hàng Hung Huong" />
                                    <div className={cx('info-text')}>Giao hàng toàn quốc</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className={cx('btn-hotline')}>
                                    <img className="img-fluid" src={images.pd6} alt="chính sách bán hàng Hung Huong" />
                                    <div className={cx('info-text')}>Thanh toán khi nhận hàng</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={cx('wrapper')}
                ref={contentRef}
                style={{
                    maxHeight: showMore ? 'none' : '600px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                    position: 'relative',
                }}
            >
                <div className="row mx-0">
                    <div className="col-12 col-md-7 order-2 order-md-1">
                        <div dangerouslySetInnerHTML={{ __html: datta }} />
                    </div>
                    <div className="col-12 col-md-5 order-1 order-md-2">
                        <h3>Thông số kỹ thuật</h3>
                        <div>
                            <a
                                href="https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/SPEC/3933800H.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={images.pdf0} width={20} alt="icon file" />
                            </a>
                            <a
                                href="https://nshpos.com/Web/Resources/Uploaded/18/images/bon%20cau/SPEC/3933800H.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Bản vẽ kỹ thuật
                            </a>
                        </div>

                        <div className="text-danger mt-3">
                            <strong>Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Euro Ceramic 3933800H</strong>
                        </div>

                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Mã Sản phẩm</strong>
                                    </td>
                                    <td>3933800H</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Tên sản phẩm</strong>
                                    </td>
                                    <td>Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Euro Ceramic 3933800H</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Thương hiệu</strong>
                                    </td>
                                    <td>Grohe</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Mã hàng hóa</strong>
                                    </td>
                                    <td>101080009</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Loại sản phẩm</strong>
                                    </td>
                                    <td>Thân bồn cầu</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Chất liệu</strong>
                                    </td>
                                    <td>Sứ</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Lượng nước xả</strong>
                                    </td>
                                    <td>3/5L</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Loại nắp</strong>
                                    </td>
                                    <td>Không gồm nắp</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Kích thước</strong>
                                    </td>
                                    <td>670 x 401 x 374 mm</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Tâm xả</strong>
                                    </td>
                                    <td>305 mm</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Áp lực nước sử dụng</strong>
                                    </td>
                                    <td>0.05MPa~0.70MPa</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {!showMore && <div className={cx('bg-article')} />}
                </div>
            </div>

            {isOverflowing && (
                <div className="row">
                    <div className="col-12 text-center">
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className="btn btn-light"
                            style={{ border: '0.5px solid #1F252C', borderRadius: 5, width: 178 }}
                        >
                            {showMore ? (
                                <>
                                    Thu gọn <FaChevronUp />
                                </>
                            ) : (
                                <>
                                    Xem thêm <FaChevronDown />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;
