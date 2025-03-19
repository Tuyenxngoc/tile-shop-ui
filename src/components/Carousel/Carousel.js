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
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 2,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 3,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 4,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 5,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 6,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 7,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 8,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 9,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
    {
        id: 10,
        description: 'Máy rửa bát Midea 13 bộ Giá sốc chỉ 8990k',
        image: 'https://nshpos.com/Web/Resources/Uploaded/18/images/Slide%20Banner-Inax.jpg',
    },
];

function Carousel() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="carousel-wrapper">
            <Swiper
                style={{
                    '--swiper-navigation-color': '#333',
                    '--swiper-pagination-color': '#333',
                }}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <img src={slide.image} alt={slide.description} />
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
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div>{slide.description}</div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Carousel;
