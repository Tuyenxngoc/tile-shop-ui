import classNames from 'classnames/bind';
import styles from './CartItem.module.scss';
import { NumberInput } from '../FormInput';
import { formatCurrency } from '~/utils/utils';

const cx = classNames.bind(styles);

function CartItem() {
    const data = {
        id: 1,
        name: 'Máy rửa bát độc lập Eurosun SMS80EU16E',
        price: 11990000,
        oldPrice: 26980000,
        discount: 55,
        imageUrl: 'https://shome.vn/w520h520/n_Web/Resources/Uploaded/1/images/Products/sms80eu16e/sms80eu16e.jpg',
        quantity: 1,
    };
    return (
        <div className="row">
            <div className="col-md-5 col-12">
                <img src={data.imageUrl} alt={data.name} className="img-fluid" width={520} />
            </div>
            <div className="col-md-7 col-12">
                <div className="row">
                    <div className="col-md-12">
                        <div className={cx('info')}>
                            <h3 className={cx('name')}>{data.name}</h3>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span className={cx('price-current')}>{formatCurrency(data.price)}</span> &nbsp; &nbsp; &nbsp;
                        <span className={cx('price-old')}>{formatCurrency(data.oldPrice)}</span> &nbsp; &nbsp; &nbsp;
                        <span className={cx('discount')}>Giảm {data.discount}%</span>
                    </div>
                    <div className="col-md-12">
                        <div className={cx('quantity-label')}>Chọn số lượng: </div>
                        <div className={cx('quantity-selector')}>
                            <NumberInput value={data.quantity} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
