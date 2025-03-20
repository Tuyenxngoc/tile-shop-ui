import { Link } from 'react-router-dom';
import Carousel from '~/components/Carousel';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import images from '~/assets';

const cx = classNames.bind(styles);

function Home() {
    return (
        <>
            <div className={cx('banner')}>
                <div className="container pb-3">
                    <Link>
                        <img src="https://nshpos.com/Web/Resources/Uploaded/18/images/1200x250(12).png" alt="" />
                    </Link>
                    <Carousel />
                </div>
            </div>

            <div className={cx('products')}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group5} alt="Chính sách khách hàng" />
                        </div>
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group6} alt="Chính sách khách hàng" />
                        </div>
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group7} alt="Chính sách khách hàng" />
                        </div>
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group8} alt="Chính sách khách hàng" />
                        </div>
                    </div>

                    <div className="row bg-white wrapper-popular" data-control-load="wrapperPopular">
                        <a href="/combo-thiet-bi-ve-sinh-nha-tam" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-thiet-bi-ve-sinh_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-thiet-bi-ve-sinh_w143_h143_n.png"
                                title="Combo Thiết Bị Vệ Sinh"
                                alt="Combo Thiết Bị Vệ Sinh"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Combo Thiết Bị Vệ Sinh</p>
                        </a>
                        <a href="/combo-thiet-bi-nha-bep" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-nha-bep_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-nha-bep_w143_h143_n.png"
                                title="Combo Thiết Bị Nhà Bếp"
                                alt="Combo Thiết Bị Nhà Bếp"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Combo Thiết Bị Nhà Bếp</p>
                        </a>
                        <a href="/bon-cau" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-cau_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-cau_w143_h143_n.png"
                                title="Bồn Cầu"
                                alt="Bồn Cầu"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Bồn Cầu</p>
                        </a>
                        <a href="/bon-tam" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-tam_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-tam_w143_h143_n.png"
                                title="Bồn Tắm"
                                alt="Bồn Tắm"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Bồn Tắm</p>
                        </a>
                        <a href="/sen-tam" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/sen-tam_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/sen-tam_w143_h143_n.png"
                                title="Sen Tắm"
                                alt="Sen Tắm"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Sen Tắm</p>
                        </a>
                        <a href="/lavabo" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lavabo_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lavabo_w143_h143_n.png"
                                title="Lavabo"
                                alt="Lavabo"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Lavabo</p>
                        </a>
                        <a
                            href="/voi-lavabo"
                            className="col-md-2 col-3 wrapper-popular-item"
                            style={{ borderRadius: '0px 0px 0px 15px' }}
                        >
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-lavabo_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-lavabo_w143_h143_n.png"
                                title="Vòi Lavabo"
                                alt="Vòi Lavabo"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Vòi Lavabo</p>
                        </a>
                        <a href="/bep-dien" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bep-tu_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bep-tu_w143_h143_n.png"
                                title="Bếp Điện"
                                alt="Bếp Điện"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Bếp Điện</p>
                        </a>
                        <a href="/hut-mui" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/hut-mui_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/hut-mui_w143_h143_n.png"
                                title="Máy Hút Mùi"
                                alt="Máy Hút Mùi"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Máy Hút Mùi</p>
                        </a>
                        <a href="/may-rua-bat" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/may-rua-bat_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/may-rua-bat_w143_h143_n.png"
                                title="Máy Rửa Bát"
                                alt="Máy Rửa Bát"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Máy Rửa Bát</p>
                        </a>
                        <a href="/lo-nuong" className="col-md-2 col-3 wrapper-popular-item">
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lo-nuong_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lo-nuong_w143_h143_n.png"
                                title="Lò Nướng"
                                alt="Lò Nướng"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Lò Nướng</p>
                        </a>
                        <a
                            href="/voi-rua-bat"
                            className="col-md-2 col-3 wrapper-popular-item"
                            style={{ borderRadius: '0px 0px 15px' }}
                        >
                            <img
                                data-lazy="thumb"
                                data-src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-rua-bat_w143_h143_n.png"
                                data-width={143}
                                data-height={143}
                                src="/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-rua-bat_w143_h143_n.png"
                                title="Vòi Rửa Bát"
                                alt="Vòi Rửa Bát"
                                className="img-fluid"
                            />
                            <p className="link-none link-black">Vòi Rửa Bát</p>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
