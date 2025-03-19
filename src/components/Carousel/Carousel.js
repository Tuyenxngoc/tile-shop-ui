import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
    { id: 1, src: 'https://nshpos.com/Web/Resources/Uploaded/18/images/1920x570(9).jpg', alt: 'Banner 1' },
    { id: 2, src: 'https://nshpos.com/Web/Resources/Uploaded/18/images/1920x570(9).jpg', alt: 'Banner 2' },
    { id: 3, src: 'https://nshpos.com/Web/Resources/Uploaded/18/images/1920x570(9).jpg', alt: 'Banner 3' },
];

function Carousel() {
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return `<span class="${className} custom-dot">${11}</span>`;
        },
    };

    return (
        <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={pagination}
            loop
        >
            {images.map((image) => (
                <SwiperSlide key={image.id}>
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default Carousel;
