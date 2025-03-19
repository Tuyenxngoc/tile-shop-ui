import { Link } from 'react-router-dom';

import { FaPhoneAlt, FaBullhorn, FaSearch, FaShoppingBasket } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaRegFlag } from 'react-icons/fa6';

import classNames from 'classnames/bind';
import styles from './Header.module.scss';

import images from '~/assets';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header>
            <div className={cx('top')}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Link to="tel:0812.882.992" className={cx('link-none')}>
                                <FaPhoneAlt /> <span>Hotline: 0812.882.992</span>
                            </Link>
                            <Link to="/he-thong-cua-hang" className={cx('link-none')}>
                                <FaMapMarkerAlt /> <span>Hệ thống Showroom</span>
                            </Link>
                        </div>
                        <div>
                            <Link to="/tin-tuc" className={cx('link-none')}>
                                <FaRegFlag /> Tin tức
                            </Link>
                            <Link to="/tin-tuc/tuyen-dung" className={cx('link-none')}>
                                <FaBullhorn /> Cơ hội việc làm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('middle')}>
                <div className="container">
                    <div className="row">
                        <div className="col col-3">
                            <Link to="/" className="link-none">
                                <img src={images.logo} className="img-fluid" alt="logo" style={{ maxWidth: 220 }} />
                            </Link>
                        </div>
                        <div className="col col-lg-4 col-md-4 col-3">
                            <div className={cx('search')}>
                                <input
                                    id="search-input"
                                    className={cx('search-input', 'form-control', 'input-lg')}
                                    placeholder="Nhập tên sản phẩm, từ khóa cần tìm"
                                    spellCheck="false"
                                    tabIndex={1}
                                />

                                <i className={cx('search-icon')}>
                                    <FaSearch />
                                </i>
                            </div>
                        </div>
                        <div className="col col-lg-5 col-md-5 col-6 text-end">
                            <div className={cx('box')}>
                                <Link to="/gio-hang" className={cx('cart')}>
                                    <i className={cx('icon')}>
                                        <FaShoppingBasket />
                                    </i>
                                    <span>Giỏ hàng</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
