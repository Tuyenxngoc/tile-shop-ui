import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';

const cx = classNames.bind(styles);

const categories = [
    { name: 'Combo Thiết Bị Vệ Sinh', id: '/combo-thiet-bi-ve-sinh-nha-tam' },
    { name: 'Combo Thiết Bị Nhà Bếp', id: '/combo-thiet-bi-nha-bep' },
    { name: 'Bồn Cầu', id: '/bon-cau' },
    { name: 'Bồn Tắm', id: '/bon-tam' },
    { name: 'Sen Tắm', id: '/sen-tam' },
    { name: 'Lavabo', id: '/lavabo' },
    { name: 'Vòi Lavabo', id: '/voi-lavabo' },
    { name: 'Bếp Điện', id: '/bep-dien' },
    { name: 'Máy Hút Mùi', id: '/hut-mui' },
    { name: 'Máy Rửa Bát', id: '/may-rua-bat' },
];

function Navbar() {
    return (
        <nav className={cx('wrapper')}>
            <div className="container">
                <ul className="nav">
                    <li className="nav-item active">
                        <Link to="#">
                            <i className="fa fa-bars" aria-hidden="true" />
                            <span className="mobile-hide">&nbsp;Tất cả danh mục |</span>
                        </Link>
                    </li>

                    {categories.map((category, index) => (
                        <li key={index} className="nav-item">
                            <Link to={category.id}>{category.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
