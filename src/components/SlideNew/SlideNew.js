import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import { FaCaretRight } from 'react-icons/fa';

import classNames from 'classnames/bind';
import styles from './SlideNew.module.scss';
import New from '../New';

const cx = classNames.bind(styles);
const news = [
    {
        id: 1,
        title: 'Top 30+ mẫu biệt thự 2 tầng hiện đại đẹp không thể bỏ qua',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/tintuc/blog/biet%20thu%202%20tang%20hien%20dai%20dep/biet-thu-2-tang-hien-dai-dep-anh-bia_w370_h190_n.jpg',
    },
    {
        id: 2,
        title: 'Cách lắp bồn cầu đúng kỹ thuật: Hướng dẫn chi tiết từ A đến Z',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/tintuc/blog/cach%20lap%20dat%20bon%20cau/cach-lap-bon-cau-anh-bia_w370_h190_n.jpg',
    },
    {
        id: 3,
        title: '100+ mẫu thiết kế biệt thự đẹp, đẳng cấp tại Việt Nam',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/tintuc/blog/thiet%20ke%20biet%20thu/thiet-ke-biet-thu-anh-bia_w370_h190_n.jpg',
    },
    {
        id: 4,
        title: 'THÁNG CỦA NÀNG 🎊 DEAL NGỠ NGÀNG 😮🔥',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/Asko/1 (6)_w370_h190_n.jpg',
    },
    {
        id: 5,
        title: '100+ ý tưởng nhà cấp 4 đẹp, thịnh hành nhất hiện nay',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/tintuc/blog/nha%20cap%204/nha-cap-4-anh-bia_w370_h190_n.jpg',
    },
];
function SlideNew() {
    return (
        <div className="container pb-3">
            <div className={cx('wrapper')}>
                <div className="row mb-4">
                    <div className="col col-md-5 col-8">
                        <h2 className={cx('title-popup')}>Tin tức</h2>
                    </div>

                    <div className="col col-md-7 col-4 text-end">
                        <a className={cx('btn-brand', 'btn-read-more')} href="/bon-cau">
                            <span>Xem tất cả</span>
                            <FaCaretRight />
                        </a>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-12">
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
                            {news.map((el, index) => (
                                <SwiperSlide key={index}>
                                    <New data={el} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlideNew;
