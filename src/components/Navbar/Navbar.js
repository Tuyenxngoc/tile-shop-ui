import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert, Spin } from 'antd';
import { FaBars } from 'react-icons/fa';

import images from '~/assets';
import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { getCategories, getCategoriesTree } from '~/services/categoryService';

const cx = classNames.bind(styles);

function Navbar() {
    const [categories, setCategories] = useState(null);
    const [categoryTree, setCategoryTree] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const [treeResponse, categoriesResponse] = await Promise.all([getCategoriesTree(), getCategories()]);

                const treeData = treeResponse.data.data;
                const { items } = categoriesResponse.data.data;

                setCategoryTree(treeData);
                setCategories(items);
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
                {isLoading ? (
                    <div className="d-flex justify-content-center w-100">
                        <Spin size="large" />
                    </div>
                ) : errorMessage ? (
                    <div className="w-100">
                        <Alert message="Lỗi" description={errorMessage} type="error" />
                    </div>
                ) : (
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
                                <Link to={`/danh-muc/${category.id}`}>{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
