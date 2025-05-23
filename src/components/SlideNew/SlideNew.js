import { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import { Alert, Empty, Spin } from 'antd';
import { FaCaretRight } from 'react-icons/fa';

import New from '../New';
import { getNews } from '~/services/newsService';

import classNames from 'classnames/bind';
import styles from './SlideNew.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SlideNew({ className }) {
    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getNews();
                const { items } = response.data.data;
                setEntityData(items);
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
        <div className={cx('wrapper', className)}>
            <div className="row mb-4">
                <div className="col col-md-5 col-8">
                    <h2 className={cx('title')}>Tin tức</h2>
                </div>

                <div className="col col-md-7 col-4 text-end">
                    <div className="d-flex align-items-center justify-content-end">
                        <Link to="tin-tuc">
                            <span className={cx('btn-read-more')}>
                                Xem tất cả <FaCaretRight />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col col-12">
                    {isLoading ? (
                        <div className="d-flex justify-content-center w-100">
                            <Spin size="large" />
                        </div>
                    ) : errorMessage ? (
                        <div className="w-100">
                            <Alert message="Lỗi" description={errorMessage} type="error" />
                        </div>
                    ) : entityData && entityData.length > 0 ? (
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#333',
                                '--swiper-pagination-color': '#333',
                            }}
                            slidesPerView={3}
                            spaceBetween={10}
                            navigation
                            modules={[Navigation]}
                        >
                            {entityData.map((news, index) => (
                                <SwiperSlide key={index}>
                                    <New data={news} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="d-flex justify-content-center w-100 py-5">
                            <Empty description="Không có tin tức nào để hiển thị." />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SlideNew;
