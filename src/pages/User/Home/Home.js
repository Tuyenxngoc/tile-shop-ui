import { Link } from 'react-router-dom';
import Carousel from '~/components/Carousel';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import SlideProduct from '~/components/SlideProduct';
import Policy from '~/components/Policy';

const cx = classNames.bind(styles);

const categories = [
    {
        href: '/combo-thiet-bi-ve-sinh-nha-tam',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-thiet-bi-ve-sinh_w143_h143_n.png',
        title: 'Combo Thiết Bị Vệ Sinh',
    },
    {
        href: '/combo-thiet-bi-nha-bep',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/combo-nha-bep_w143_h143_n.png',
        title: 'Combo Thiết Bị Nhà Bếp',
    },
    {
        href: '/bon-cau',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-cau_w143_h143_n.png',
        title: 'Bồn Cầu',
    },
    {
        href: '/bon-tam',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bon-tam_w143_h143_n.png',
        title: 'Bồn Tắm',
    },
    {
        href: '/sen-tam',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/sen-tam_w143_h143_n.png',
        title: 'Sen Tắm',
    },
    {
        href: '/lavabo',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lavabo_w143_h143_n.png',
        title: 'Lavabo',
    },
    {
        href: '/voi-lavabo',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-lavabo_w143_h143_n.png',
        title: 'Vòi Lavabo',
        style: { borderRadius: '0px 0px 0px 15px' },
    },
    {
        href: '/bep-dien',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/bep-tu_w143_h143_n.png',
        title: 'Bếp Điện',
    },
    {
        href: '/hut-mui',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/hut-mui_w143_h143_n.png',
        title: 'Máy Hút Mùi',
    },
    {
        href: '/may-rua-bat',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/may-rua-bat_w143_h143_n.png',
        title: 'Máy Rửa Bát',
    },
    {
        href: '/lo-nuong',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/lo-nuong_w143_h143_n.png',
        title: 'Lò Nướng',
    },
    {
        href: '/voi-rua-bat',
        imgSrc: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/icon-danh-muc/voi-rua-bat_w143_h143_n.png',
        title: 'Vòi Rửa Bát',
        style: { borderRadius: '0px 0px 15px' },
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
                                <a href={item.href} className={cx('popular-item')}>
                                    <img src={item.imgSrc} alt={item.title} className="img-fluid" />
                                    <p className="link-none link-black">{item.title}</p>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <SlideProduct />
            </div>
        </>
    );
}

export default Home;
