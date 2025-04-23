import { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import { Alert, Spin } from 'antd';
import { FaCaretRight } from 'react-icons/fa';

import New from '../New';
import { getNews } from '~/services/newsService';

import classNames from 'classnames/bind';
import styles from './SlideNew.module.scss';

const cx = classNames.bind(styles);

function SlideNew() {
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
        <div className="container pb-3">
            <div className={cx('wrapper')}>
                <div className="row mb-4">
                    <div className="col col-md-5 col-8">
                        <h2 className={cx('title-popup')}>Tin tức</h2>
                    </div>

                    <div className="col col-md-7 col-4 text-end">
                        <a className={cx('btn-brand', 'btn-read-more')} href="/tin-tuc">
                            <span>Xem tất cả</span>
                            <FaCaretRight />
                        </a>
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
                        ) : (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlideNew;
