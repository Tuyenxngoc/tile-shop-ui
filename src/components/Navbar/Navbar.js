import React from 'react';
import { Link } from 'react-router-dom';

import { FaBars } from 'react-icons/fa';
import images from '~/assets';

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

const categoryTree = [
    {
        id: 1,
        name: 'category1',
        sub: [
            {
                id: 2,
                name: 'sub_category1',
                sub: null,
            },
            {
                id: 3,
                name: 'sub_category3',
                sub: null,
            },
        ],
    },
    {
        id: 10,
        name: 'category2',
        sub: [
            {
                id: 12,
                name: '2sub_category1',
                sub: null,
            },
            {
                id: 13,
                name: '2sub_category3',
                sub: null,
            },
        ],
    },
];

function Navbar() {
    return (
        <nav className={cx('wrapper')}>
            <div className="container">
                <ul className="nav">
                    <li className={cx('item', 'active')}>
                        <Link to="#" className="d-flex align-items-center">
                            <FaBars />
                            <span className="flex-grow-1">&nbsp;Tất cả danh mục |</span>
                        </Link>

                        <ul className={cx('list-group')}>
                            {categoryTree.map((category, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <li className={cx('list-group-item', 'list-master-group-item')}>
                                            <div className={cx('row-menu-category')}>
                                                <span>
                                                    <a href={category.id}>{category.name}</a>
                                                </span>
                                                <span className={cx('right')}>
                                                    <img src={images.right} alt="icon" />
                                                </span>
                                            </div>
                                        </li>

                                        {category.sub &&
                                            category.sub.map((subCategory, j) => (
                                                <li key={j} className={cx('list-group-item')}>
                                                    <div className={cx('row-menu-category')}>
                                                        <span>
                                                            <a href={subCategory.id}>{subCategory.name}</a>
                                                        </span>
                                                        <span className={cx('right')}>
                                                            <img src={images.right} alt="icon" />
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    </li>

                    {categories.map((category, index) => (
                        <li key={index} className={cx('item')}>
                            <Link to={category.id}>{category.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
