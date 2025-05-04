import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Dropdown } from 'antd';
import Swal from 'sweetalert2';

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

import useAuth from '~/hooks/useAuth';
import useStore from '~/hooks/useStore';
import { searchProducts } from '~/services/productService';
import useDebounce from '~/hooks/useDebounce';
import { formatCurrency } from '~/utils';

const cx = classNames.bind(styles);

function Header() {
    const {
        storeInfo: { phone, logo },
    } = useStore();
    const { isAuthenticated, user, logout } = useAuth();

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            navigate(`/tim-kiem?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleCartClick = () => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Bạn chưa đăng nhập!',
                text: 'Vui lòng đăng nhập hoặc đăng ký để tiếp tục.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập',
                cancelButtonText: 'Đăng ký',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dang-nhap');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate('/dang-ky');
                }
            });
        } else {
            navigate('/gio-hang');
        }
    };

    useEffect(() => {
        if (debouncedSearch.trim()) {
            const fetchSuggestions = async () => {
                try {
                    const response = await searchProducts(debouncedSearch);
                    setSuggestions(response.data.data.items);
                    setShowSuggestions(true);
                } catch {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedSearch]);

    const userMenuItems = [
        {
            key: 'profile',
            label: <Link to="/ho-so">Trang cá nhân</Link>,
            icon: <FaUser />,
        },
        {
            key: 'orders',
            label: <Link to="/ho-so/don-hang">Đơn hàng</Link>,
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
                            <Link className={cx('top-link')} to="/tin-tuc/he-thong-cua-hang">
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
                                <img src={logo} className="img-fluid" alt="logo" style={{ maxWidth: 220 }} />
                            </Link>
                        </div>
                        <div className="col col-lg-4 col-md-4 col-3">
                            <div className={cx('search')}>
                                <input
                                    id="search-input"
                                    className={cx('search-input', 'form-control', 'input-lg')}
                                    placeholder="Nhập tên sản phẩm, từ khóa cần tìm"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (suggestions.length > 0) setShowSuggestions(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                />

                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className={cx('suggestions')}>
                                        {suggestions.map((item) => (
                                            <li key={item.id} onClick={() => navigate(`/san-pham/${item.slug}`)}>
                                                <div className="row g-0">
                                                    <div className="col-3">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            width={52}
                                                            className="img-fluid"
                                                        />
                                                    </div>
                                                    <div className="col-9">
                                                        <div className="p-1">
                                                            <Link
                                                                to={`/san-pham/${item.slug}`}
                                                                className="text-truncate-2"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <span className={cx('sale-price')}>
                                                                {formatCurrency(item.salePrice)}
                                                            </span>
                                                            &nbsp; &nbsp;
                                                            <span className={cx('base-price')}>
                                                                {formatCurrency(item.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <i className={cx('search-icon')}>
                                    <FaSearch />
                                </i>
                            </div>
                        </div>
                        <div className="col col-lg-5 col-md-5 col-6 text-end">
                            <div className={cx('box')}>
                                <div className={cx('btn-link')} onClick={handleCartClick}>
                                    <i className={cx('icon')}>
                                        <FaShoppingBasket />
                                    </i>
                                    <span>Giỏ hàng</span>
                                </div>
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
                                            <span>{user.username}</span>
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
