import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaBars } from 'react-icons/fa';
import images from '~/assets';

import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { getCategoriesTree } from '~/services/categoryService';

const cx = classNames.bind(styles);

const categories1 = [
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
    const [categories, setCategories] = useState(categories1);
    const [categoryTree, setCategoryTree] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getCategoriesTree();
                const { data } = response.data;
                setCategoryTree(data);
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, []);

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
                            {categoryTree.map((category) => {
                                return (
                                    <React.Fragment key={category.id}>
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

                                        {category.subCategories &&
                                            category.subCategories.map((subCategory) => (
                                                <li key={subCategory.id} className={cx('list-group-item')}>
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
