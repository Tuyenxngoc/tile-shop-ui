import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './Carousel.scss';

import { Alert, Spin } from 'antd';
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules';
import { getSlides } from '~/services/slideService';

function Carousel() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getSlides();
                const { data } = response.data;
                setEntityData(data);
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
        <div className="carousel-wrapper">
            {isLoading ? (
                <div className="d-flex justify-content-center w-100">
                    <Spin size="large" />
                </div>
            ) : errorMessage ? (
                <div className="w-100">
                    <Alert message="Lỗi" description={errorMessage} type="error" />
                </div>
            ) : (
                <>
                    <Swiper
                        style={{
                            '--swiper-navigation-color': '#333',
                            '--swiper-pagination-color': '#333',
                        }}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                    >
                        {entityData.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <Link to={slide.link}>
                                    <img src={slide.imageUrl} alt={slide.description} />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={4}
                        slidesPerView={5}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                    >
                        {entityData.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <div>{slide.description}</div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </div>
    );
}

export default Carousel;
