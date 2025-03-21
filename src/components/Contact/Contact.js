import classNames from 'classnames/bind';
import styles from './Contact.module.scss';
import images from '~/assets';

const cx = classNames.bind(styles);

function Contact({ contactNumber }) {
    return (
        <div className={cx('button-contact-vr')}>
            <div className={cx('gom-all-in-one')}>
                <div className={cx('button-contact', 'zalo-vr')}>
                    <div className={cx('phone-vr')}>
                        <div className={cx('phone-vr-circle-fill')} />
                        <div className={cx('phone-vr-img-circle')}>
                            <a target="_blank" rel="noreferrer" href={`https://zalo.me/${contactNumber}`}>
                                <img src={images.zalo} alt="zalo" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className={cx('button-contact', 'phone-vr')}>
                    <div className={cx('phone-vr')}>
                        <div className={cx('phone-vr-circle-fill')} />
                        <div className={cx('phone-vr-img-circle')}>
                            <a href={`tel:${contactNumber}`}>
                                <img src={images.phone} alt="phone" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
