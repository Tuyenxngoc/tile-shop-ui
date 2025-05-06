import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Spin } from 'antd';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import images from '~/assets';
import useStore from '~/hooks/useStore';
import SlideProduct from '~/components/SlideProduct';
import Carousel from '~/components/Carousel';
import Policy from '~/components/Policy';
import SlideNew from '~/components/SlideNew';
import { getCategories } from '~/services/categoryService';

const cx = classNames.bind(styles);

function Home() {
    const {
        storeInfo: { bannerLink, bannerImage, backgroundImage, backgroundColor },
    } = useStore();

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
        <>
            <div
                className={cx('banner')}
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundColor: backgroundColor,
                }}
            >
                <div className="container pb-3">
                    <Link to={bannerLink}>
                        <img src={bannerImage} alt="Hình ảnh banner" />
                    </Link>
                    <Carousel />
                </div>
            </div>

            <div style={{ backgroundColor: backgroundColor }}>
                <Policy />

                <div className="container pb-3">
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
                                            src={item.imgUrl || images.categoryDefault}
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

                <SlideProduct />

                <SlideProduct />

                <SlideProduct />

                <SlideNew />
            </div>
        </>
    );
}

export default Home;
