import classNames from 'classnames/bind';
import styles from './Contact.module.scss';
import images from '~/assets';

const cx = classNames.bind(styles);

function Contact({ contactNumber }) {
    return (
        <div className={cx('btn-group')}>
            <div className={cx('btn-item', 'zalo')}>
                <div className={cx('icon-wrap')}>
                    <div className={cx('circle-bg')} />
                    <div className={cx('circle-img')}>
                        <a target="_blank" rel="noreferrer" href={`https://zalo.me/${contactNumber}`}>
                            <img src={images.zalo} alt="zalo" />
                        </a>
                    </div>
                </div>
            </div>
            <div className={cx('btn-item', 'phone')}>
                <div className={cx('icon-wrap')}>
                    <div className={cx('circle-bg')} />
                    <div className={cx('circle-img')}>
                        <a href={`tel:${contactNumber}`}>
                            <img src={images.phone} alt="phone" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
