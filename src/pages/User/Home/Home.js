import { Link } from 'react-router-dom';
import Carousel from '~/components/Carousel';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import SlideProduct from '~/components/SlideProduct';
import Policy from '~/components/Policy';

const cx = classNames.bind(styles);

const categories = [
    {
        nameSlug: '/combo-thiet-bi-ve-sinh-nha-tam',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-thiet-bi-ve-sinh_w143_h143_n.png',
        title: 'Combo Thiết Bị Vệ Sinh',
    },
    {
        nameSlug: '/combo-thiet-bi-nha-bep',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-nha-bep_w143_h143_n.png',
        title: 'Combo Thiết Bị Nhà Bếp',
    },
    {
        nameSlug: '/bon-cau',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-cau_w143_h143_n.png',
        title: 'Bồn Cầu',
    },
    {
        nameSlug: '/bon-tam',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-tam_w143_h143_n.png',
        title: 'Bồn Tắm',
    },
    {
        nameSlug: '/sen-tam',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/sen-tam_w143_h143_n.png',
        title: 'Sen Tắm',
    },
    {
        nameSlug: '/lavabo',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lavabo_w143_h143_n.png',
        title: 'Lavabo',
    },
    {
        nameSlug: '/voi-lavabo',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-lavabo_w143_h143_n.png',
        title: 'Vòi Lavabo',
    },
    {
        nameSlug: '/bep-dien',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bep-tu_w143_h143_n.png',
        title: 'Bếp Điện',
    },
    {
        nameSlug: '/hut-mui',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/hut-mui_w143_h143_n.png',
        title: 'Máy Hút Mùi',
    },
    {
        nameSlug: '/may-rua-bat',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/may-rua-bat_w143_h143_n.png',
        title: 'Máy Rửa Bát',
    },
    {
        nameSlug: '/lo-nuong',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lo-nuong_w143_h143_n.png',
        title: 'Lò Nướng',
    },
    {
        nameSlug: '/voi-rua-bat',
        img: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-rua-bat_w143_h143_n.png',
        title: 'Vòi Rửa Bát',
    },
];

function Home() {
    return (
        <>
            <div className={cx('banner')}>
                <div className="container pb-3">
                    <Link>
                        <img src="https://nshpos.com/Web/Resources/Uploaded/18/images/1200x250(12).png" alt="" />
                    </Link>
                    <Carousel />
                </div>
            </div>

            <div className={cx('products')}>
                <Policy />

                <div className="container pb-3">
                    <div className="row g-0">
                        {categories.map((item, index) => (
                            <div key={index} className="col-md-2 col-3">
                                <a href={item.nameSlug} className={cx('popular-item')}>
                                    <img src={item.img} alt={item.title} className="img-fluid" />
                                    <p>{item.title}</p>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <SlideProduct />

                <SlideProduct />

                <SlideProduct />
            </div>
        </>
    );
}

export default Home;
