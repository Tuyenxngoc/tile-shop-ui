import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './New.module.scss';
import { FaEye } from 'react-icons/fa6';

const cx = classNames.bind(styles);

function New({ data }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('hover-mask')}>
                <Link to={`/tin-tuc/${data.slug}`} className="rounded">
                    <img src={data.imageUrl} alt={data.title} className="img-fluid" />
                    <div>
                        <i>
                            <FaEye />
                        </i>
                    </div>
                </Link>
            </div>

            <div className={cx('content')}>
                <Link to={`/tin-tuc/${data.slug}`}>
                    <h3>{data.title}</h3>
                </Link>
            </div>
        </div>
    );
}

export default New;
