import { Link, useNavigate } from 'react-router-dom';

import { Dropdown } from 'antd';

import {
    FaPhoneAlt,
    FaBullhorn,
    FaSearch,
    FaShoppingBasket,
    FaRegUserCircle,
    FaUser,
    FaMapMarkerAlt,
    FaRegEdit,
} from 'react-icons/fa';
import { FaRegFlag } from 'react-icons/fa6';
import { IoIosLogOut } from 'react-icons/io';

import classNames from 'classnames/bind';
import styles from './Header.module.scss';

import images from '~/assets';
import useStore from '~/hooks/useStore';
import useAuth from '~/hooks/useAuth';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const { phone } = useStore();
    const { isAuthenticated, user, logout } = useAuth();

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: <Link to="/tai-khoan">Trang cá nhân</Link>,
            icon: <FaUser />,
        },
        {
            key: 'orders',
            label: <Link to="/don-hang">Đơn hàng</Link>,
            icon: <FaRegEdit />,
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <IoIosLogOut />,
            onClick: handleLogout,
        },
    ];

    return (
        <header>
            <div className={cx('top')}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <a className={cx('top-link')} href={`tel:${phone}`}>
                                <FaPhoneAlt /> <span>Hotline: {phone}</span>
                            </a>
                            <Link className={cx('top-link')} to="/he-thong-cua-hang">
                                <FaMapMarkerAlt /> <span>Hệ thống Showroom</span>
                            </Link>
                        </div>
                        <div>
                            <Link className={cx('top-link')} to="/tin-tuc">
                                <FaRegFlag /> Tin tức
                            </Link>
                            <Link className={cx('top-link')} to="/tin-tuc/tuyen-dung">
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
                            <Link to="/">
                                <img src={images.logo} className="img-fluid" alt="logo" style={{ maxWidth: 220 }} />
                            </Link>
                        </div>
                        <div className="col col-lg-4 col-md-4 col-3">
                            <div className={cx('search')}>
                                <input
                                    id="search-input"
                                    className={cx('search-input', 'form-control', 'input-lg')}
                                    placeholder="Nhập tên sản phẩm, từ khóa cần tìm"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                />

                                <i className={cx('search-icon')}>
                                    <FaSearch />
                                </i>
                            </div>
                        </div>
                        <div className="col col-lg-5 col-md-5 col-6 text-end">
                            <div className={cx('box')}>
                                <Link to="/gio-hang" className={cx('btn-link')}>
                                    <i className={cx('icon')}>
                                        <FaShoppingBasket />
                                    </i>
                                    <span>Giỏ hàng</span>
                                </Link>
                            </div>
                            <div className={cx('box')}>
                                {isAuthenticated ? (
                                    <Dropdown
                                        menu={{ items: userMenuItems }}
                                        trigger={['click']}
                                        placement="bottomRight"
                                    >
                                        <div className={cx('btn-link')} style={{ cursor: 'pointer' }}>
                                            <i className={cx('icon')}>
                                                <FaRegUserCircle />
                                            </i>
                                            <span>{user.name}</span>
                                        </div>
                                    </Dropdown>
                                ) : (
                                    <Link to="/dang-nhap" className={cx('btn-link')}>
                                        <i className={cx('icon')}>
                                            <FaRegUserCircle />
                                        </i>
                                        <span>Đăng nhập</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
