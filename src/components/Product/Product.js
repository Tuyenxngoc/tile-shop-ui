import { Link } from 'react-router-dom';

import { Rate } from 'antd';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

import { formatCurrency } from '~/utils/utils';

import classNames from 'classnames/bind';
import styles from './Product.module.scss';

const cx = classNames.bind(styles);

function Product({ data, onAddToCart }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('hover-mask')}>
                <Link to={data.slug} className="rounded">
                    <img src={data.imageUrl} alt={data.name} className="img-fluid" />
                    <div>
                        <i>
                            <FaSearch />
                        </i>
                    </div>
                </Link>
            </div>
            <div className={cx('content')}>
                <Link to={data.slug}>
                    <h3>{data.name}</h3>
                </Link>
            </div>
            <div className={cx('base-price')}>
                {data.discountPercentage > 0 ? (
                    <>
                        <span className={cx('original-price')}>{formatCurrency(data.price)}</span>
                        <span className={cx('sale-off-ratio')}>(Tiết kiệm: {data.discountPercentage}%)</span>
                    </>
                ) : (
                    <span>&nbsp;</span>
                )}
            </div>

            <div className={cx('sale-price')}>{formatCurrency(data.salePrice)}</div>
            <div className={cx('actions')}>
                <div className={cx('vote')}>
                    <Rate value={data.averageRating} disabled />
                    <span>({data.averageRating})</span>
                </div>
                <div className={cx('cart')} onClick={onAddToCart}>
                    <FaShoppingCart />
                </div>
            </div>
        </div>
    );
}

export default Product;
