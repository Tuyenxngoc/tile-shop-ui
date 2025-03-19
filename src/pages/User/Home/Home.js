import { Link } from 'react-router-dom';
import Carousel from '~/components/Carousel';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';

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
            <div className={cx('products')}>san pham...</div>
        </>
    );
}

export default Home;
