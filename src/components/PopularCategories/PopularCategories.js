import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Spin } from 'antd';

import classNames from 'classnames/bind';
import styles from './PopularCategories.module.scss';

import images from '~/assets';
import { getCategories } from '~/services/categoryService';

const cx = classNames.bind(styles);

function PopularCategories({ className }) {
    const [categories, setCategories] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getCategories({ pageNum: 1, pageSize: 12 });
                const { items } = response.data.data;
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
        <div className={className}>
            <div className="row g-0">
                {isLoading ? (
                    <div className="d-flex justify-content-center w-100">
                        <Spin size="large" />
                    </div>
                ) : errorMessage ? (
                    <div className="w-100">
                        <Alert message="Lỗi" description={errorMessage} type="error" />
                    </div>
                ) : (
                    categories.map((item, index) => (
                        <div key={index} className="col-md-2 col-3">
                            <Link to={item.slug} className={cx('popular-item')}>
                                <img
                                    src={item.imageUrl || images.categoryDefault}
                                    alt={item.name}
                                    className="img-fluid"
                                />
                                <p>{item.name}</p>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PopularCategories;
