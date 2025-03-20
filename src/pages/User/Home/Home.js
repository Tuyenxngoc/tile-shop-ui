import { Link } from 'react-router-dom';
import Carousel from '~/components/Carousel';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import images from '~/assets';

const cx = classNames.bind(styles);

function Home() {
    return (
        <>
            <div className={cx('banner')}>
                <div className="container">
                    <Link>
                        <img src="https://nshpos.com/Web/Resources/Uploaded/18/images/1200x250(12).png" alt="" />
                    </Link>
                    <Carousel />
                </div>
            </div>

            <div className={cx('products')}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group5} alt="Chính sách khách hàng" />
                        </div>
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group6} alt="Chính sách khách hàng" />
                        </div>
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group7} alt="Chính sách khách hàng" />
                        </div>
                        <div className="col-md-3">
                            <img className="img-fluid" src={images.group8} alt="Chính sách khách hàng" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
