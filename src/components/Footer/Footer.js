import images from '~/assets';
import './Footer.scss';

function Footer() {
    return (
        <footer className="background-white">
            <div className="container" style={{ paddingRight: '15px!important', paddingLeft: '15px!important' }}>
                <div className="row">
                    <div className="col col-12">
                        <a href="/" className="link-none">
                            <img src={images.logo} style={{ width: 252 }} className="img-fluid" alt="logo" />
                        </a>
                    </div>
                </div>
                <div className="row" style={{ marginBottom: 70 }}>
                    <div className="col col-md-3 col-12">
                        <div className="row">
                            <div className="col col-12 footer-title">
                                <strong>Tổng đài</strong>
                            </div>
                            <div className="col-md-6 col-5" style={{ paddingRight: 0 }}>
                                <p className="footer-link-none link-black">
                                    <img
                                        src={images.PhoneCall}
                                        className="img-fluid"
                                        style={{ width: 20 }}
                                        alt="phone"
                                    />
                                    &nbsp;&nbsp;&nbsp;Mua hàng:
                                </p>
                            </div>
                            <div className="col-md-6 col-7" style={{ paddingLeft: 0 }}>
                                <p className="footer-link-none link-black">
                                    <a className="footer-link-none link-black" href="tel:0812.882.992">
                                        0812.882.992
                                    </a>
                                </p>
                            </div>
                            <div className="col-md-6 col-5" style={{ paddingRight: 0 }}>
                                <p className="footer-link-none link-black">
                                    <img
                                        src={images.Headphones}
                                        className="img-fluid"
                                        style={{ width: 20 }}
                                        alt="cskh"
                                    />
                                    &nbsp;&nbsp;&nbsp;CSKH:
                                </p>
                            </div>
                            <div className="col-md-6 col-7" style={{ paddingLeft: 0 }}>
                                <p className="footer-link-none link-black">
                                    <a className="footer-link-none link-black" href="tel:19000.55536">
                                        19000.55536
                                    </a>
                                </p>
                            </div>
                            <div className="col-md-6 col-5" style={{ paddingRight: 0 }}>
                                <p className="footer-link-none link-black">
                                    <img
                                        src={images.Envelope}
                                        className="img-fluid"
                                        style={{ width: 20 }}
                                        alt="email"
                                    />
                                    &nbsp;&nbsp;&nbsp;Email:
                                </p>
                            </div>
                            <div className="col-md-6 col-7" style={{ paddingLeft: 0 }}>
                                <p className="footer-link-none link-black">
                                    <a className="footer-link-none link-black" href="mailto:cskh@shome.vn">
                                        cskh@shome.vn
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12" style={{ paddingTop: 30 }}>
                                <p className="footer-link-none link-black">Kết nối với chúng tôi:</p>
                            </div>
                            <div className="col-12" style={{ padding: '15px 15px 30px 15px' }}>
                                <a href="https://www.facebook.com/shomesolution" target="_blank" rel="noreferrer">
                                    <img
                                        className="img-fluid"
                                        style={{ width: 35, marginRight: 10 }}
                                        alt="facebook"
                                        title=""
                                        src={images.facebook}
                                    />
                                </a>
                                <a href="https://www.youtube.com/@Shomesolution" target="_blank" rel="noreferrer">
                                    <img
                                        className="img-fluid"
                                        style={{ width: 35 }}
                                        alt="youtube"
                                        title=""
                                        src={images.youtube}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-3">
                        <div className="row">
                            <div className="col col-12 footer-title">
                                <strong>Thông tin công ty</strong>
                            </div>
                            <div className="col col-12">
                                <a className="footer-link-none link-black" href="/he-thong-cua-hang">
                                    Xem hệ thống cửa hàng
                                </a>
                            </div>
                            <div className="col col-12">
                                <a className="footer-link-none link-black" href="/thong-tin-cong-ty/gioi-thieu-cong-ty">
                                    Giới thiệu công ty
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-3">
                        <div className="row">
                            <div className="col col-12 footer-title">
                                <strong>Tin tức</strong>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    target="_blank"
                                    href="https://shome.vn/tin-tuc/tuyen-dung"
                                    rel="noreferrer"
                                >
                                    Tuyển dụng S.HOME
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-3 col-12">
                        <div className="row">
                            <div className="col col-12 footer-title">
                                <strong>Hỗ trợ</strong>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/chinh-sach-doi-tra-hang-va-hoan-tien"
                                    rel="nofollow"
                                >
                                    Chính sách đổi trả hàng và hoàn tiền
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/chinh-sach-kiem-hang"
                                    rel="nofollow"
                                >
                                    Chính sách kiểm hàng
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/chinh-sach-lap-dat"
                                    rel="nofollow"
                                >
                                    Chính sách lắp đặt
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/chinh-sach-van-chuyen-va-giao-hang"
                                    rel="nofollow"
                                >
                                    Chính sách vận chuyển và giao hàng
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/thong-tin-ve-dieu-kien-giao-dich-chung"
                                    rel="nofollow"
                                >
                                    Thông tin về điều kiện giao dịch chung
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/quy-dinh-bao-mat-tai-shome-solution"
                                    rel="nofollow"
                                >
                                    Quy định bảo mật tại S.Home Solution
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/quy-dinh-hinh-thuc-thanh-toan"
                                    rel="nofollow"
                                >
                                    Quy định hình thức thanh toán
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/chinh-sach-bao-hanh-san-pham"
                                    rel="nofollow"
                                >
                                    Chính sách bảo hành sản phẩm
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    href="/ho-tro-khach-hang/dieu-khoan-mua-ban-hang-hoa"
                                    rel="nofollow"
                                >
                                    Điều khoản mua bán hàng hóa
                                </a>
                            </div>
                            <div className="col col-12">
                                <a
                                    className="footer-link-none link-black"
                                    target="_blank"
                                    href="https://baohanh.shome.vn"
                                    rel="noreferrer"
                                >
                                    Kích hoạt và tra cứu bảo hành
                                </a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12" style={{ paddingTop: 30 }}>
                                <p className="footer-link-none link-black">
                                    <b>Hỗ trợ thanh toán</b>
                                </p>
                            </div>
                            <div className="col-12 pt-2">
                                <img
                                    className="img-fluid"
                                    style={{ width: 50 }}
                                    alt="visa"
                                    title=""
                                    src={images.visa}
                                />
                                <img className="img-fluid" style={{ width: 50 }} alt="jcb" title="" src={images.jcb} />
                                <img
                                    className="img-fluid"
                                    style={{ width: 50 }}
                                    alt="mastercard"
                                    title=""
                                    src={images.mastercard}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12" style={{ backgroundColor: '#f6f6f6' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 col-12">
                            <p style={{ margin: '10px 0 0 0' }}>
                                <span className="footer-infor">
                                    <i className="fa fa-copyright" aria-hidden="true" />
                                    Copyright 2023. Công ty TNHH TM S.Home Solution
                                </span>
                            </p>
                            <p>
                                <span className="footer-infor">
                                    Địa chỉ: 14/120 Định Công, P. Phương Liệt, Q. Thanh Xuân, Tp. Hà Nội, Việt Nam
                                </span>
                            </p>
                        </div>
                        <div className="col-md-3 col-12">
                            <a target="_blank" rel="noreferrer" href="http://online.gov.vn/Home/WebDetails/88404">
                                <img
                                    className="img-fluid"
                                    style={{ width: 150, paddingTop: 10 }}
                                    alt="logo bộ công thương"
                                    title=""
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
