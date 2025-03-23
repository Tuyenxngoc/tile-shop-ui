import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import { FaRegCopyright } from 'react-icons/fa';

import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

import images from '~/assets';
import useStore from '~/hooks/useStore';

const cx = classNames.bind(styles);

const socialLinks = [
    { href: 'https://www.facebook.com/hunghuong', img: images.facebook, alt: 'facebook' },
    { href: 'https://www.youtube.com/@hunghuong', img: images.youtube, alt: 'youtube' },
];

const newsLinks = [{ id: 1, name: 'Tuyển dụng', nameSlug: '/tin-tuc/tuyen-dung' }];

const supportLinks = [
    { label: 'Chính sách đổi trả hàng và hoàn tiền', link: '/ho-tro-khach-hang/chinh-sach-doi-tra-hang-va-hoan-tien' },
    { label: 'Chính sách kiểm hàng', link: '/ho-tro-khach-hang/chinh-sach-kiem-hang' },
    { label: 'Chính sách lắp đặt', link: '/ho-tro-khach-hang/chinh-sach-lap-dat' },
    { label: 'Chính sách vận chuyển và giao hàng', link: '/ho-tro-khach-hang/chinh-sach-van-chuyen-va-giao-hang' },
    {
        label: 'Thông tin về điều kiện giao dịch chung',
        link: '/ho-tro-khach-hang/thong-tin-ve-dieu-kien-giao-dich-chung',
    },
    { label: 'Quy định bảo mật', link: '/ho-tro-khach-hang/quy-dinh-bao-mat-tai-shome-solution' },
    { label: 'Quy định hình thức thanh toán', link: '/ho-tro-khach-hang/quy-dinh-hinh-thuc-thanh-toan' },
    { label: 'Chính sách bảo hành sản phẩm', link: '/ho-tro-khach-hang/chinh-sach-bao-hanh-san-pham' },
    { label: 'Điều khoản mua bán hàng hóa', link: '/ho-tro-khach-hang/dieu-khoan-mua-ban-hang-hoa' },
    { label: 'Kích hoạt và tra cứu bảo hành', link: '/bao-hanh' },
];

function Footer() {
    const { name, address, phone, phoneSupport, email } = useStore();

    return (
        <footer className={cx('wrapper')}>
            <div className="container pt-3 pb-5">
                <div className="row">
                    <div className="col col-12">
                        <a href="/">
                            <img src={images.logo} width={252} className="img-fluid" alt="logo" />
                        </a>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-md-3 col-12">
                        <div className="row g-0 mb-3">
                            <div className={cx('col', 'col-12', 'title')}>
                                <strong>Tổng đài</strong>
                            </div>
                            <div className="col-md-6 col-5">
                                <img src={images.PhoneCall} className="img-fluid" width={20} alt="phone" />
                                &nbsp;&nbsp;&nbsp;Mua hàng:
                            </div>
                            <div className="col-md-6 col-7">
                                <a href={`tel:${phone}`}>{phone}</a>
                            </div>
                            <div className="col-md-6 col-5">
                                <img src={images.Headphones} className="img-fluid" width={20} alt="cskh" />
                                &nbsp;&nbsp;&nbsp;CSKH:
                            </div>
                            <div className="col-md-6 col-7">
                                <a href={`tel:${phoneSupport}`}>{phoneSupport}</a>
                            </div>
                            <div className="col-md-6 col-5">
                                <img src={images.Envelope} className="img-fluid" width={20} alt="email" />
                                &nbsp;&nbsp;&nbsp;Email:
                            </div>
                            <div className="col-md-6 col-7">
                                <a href={`mailto:${email}`}>{email}</a>
                            </div>
                        </div>
                        <div className="row">
                            <div className={cx('col', 'col-12', 'title')}>
                                <strong>Kết nối với chúng tôi:</strong>
                            </div>
                            <div className="col col-12">
                                {socialLinks.map(({ href, img, alt }, index) => (
                                    <a key={index} href={href} target="_blank" rel="noreferrer">
                                        <img className="img-fluid me-3" width={35} alt={alt} src={img} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-3">
                        <div className="row">
                            <div className={cx('col', 'col-12', 'title')}>
                                <strong>Thông tin công ty</strong>
                            </div>
                            <div className="col col-12">
                                <a href="/he-thong-cua-hang">Xem hệ thống cửa hàng</a>
                            </div>
                            <div className="col col-12">
                                <a href="/thong-tin-cong-ty/gioi-thieu-cong-ty">Giới thiệu công ty</a>
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-3">
                        <div className="row">
                            <div className={cx('col', 'col-12', 'title')}>
                                <strong>Tin tức</strong>
                            </div>
                            {newsLinks.map((el, index) => (
                                <div key={index} className="col col-12">
                                    <Link to={el.nameSlug}>{el.name}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col col-md-3 col-12">
                        <div className="row">
                            <div className={cx('col', 'col-12', 'title')}>
                                <strong>Hỗ trợ</strong>
                            </div>

                            {supportLinks.map((item, index) => (
                                <div className="col col-12" key={index}>
                                    <a href={item.link}>{item.label}</a>
                                </div>
                            ))}
                        </div>
                        <div className="row">
                            <div className={cx('col', 'col-12', 'title')}>
                                <strong>Hỗ trợ thanh toán</strong>
                            </div>
                            <div className="col col-12">
                                <img className="img-fluid" width={50} alt="visa" src={images.visa} />
                                <img className="img-fluid mx-3" width={50} alt="jcb" src={images.jcb} />
                                <img className="img-fluid" width={50} alt="mastercard" src={images.mastercard} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('copyright')}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 col-12">
                            <p className="mb-0 mt-3">
                                <span className={cx('infor')}>
                                    <FaRegCopyright /> Copyright {dayjs().year()}. {name}
                                </span>
                            </p>
                            <p className="mb-0">
                                <span className={cx('infor')}>Địa chỉ: {address}</span>
                            </p>
                        </div>
                        <div className="col-md-3 col-12">
                            <a target="_blank" rel="noreferrer" href="http://online.gov.vn">
                                <img
                                    className="img-fluid my-3"
                                    width={150}
                                    alt="logo bộ công thương"
                                    src={images.logoSaleNoti}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
