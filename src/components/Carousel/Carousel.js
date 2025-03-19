import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './Carousel.scss';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

const slides = [
    {
        id: 1,
        description: 'Hình ảnh thiên nhiên 1',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 2,
        description: 'Hình ảnh thiên nhiên 2',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 3,
        description: 'Hình ảnh thiên nhiên 3',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 4,
        description: 'Hình ảnh thiên nhiên 4',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 5,
        description: 'Hình ảnh thiên nhiên 5',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 6,
        description: 'Hình ảnh thiên nhiên 6',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 7,
        description: 'Hình ảnh thiên nhiên 7',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 8,
        description: 'Hình ảnh thiên nhiên 8',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 9,
        description: 'Hình ảnh thiên nhiên 9',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 10,
        description: 'Hình ảnh thiên nhiên 10',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
];

function Carousel() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#333',
                    '--swiper-pagination-color': '#333',
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className=""
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <img src={slide.image} alt={slide.description} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div>{slide.description}</div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

export default Carousel;
