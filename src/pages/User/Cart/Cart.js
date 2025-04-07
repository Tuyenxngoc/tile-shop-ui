import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '~/components/CartItem';

import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Button } from 'antd';
import { formatCurrency } from '~/utils/utils';

const cx = classNames.bind(styles);

function Cart() {
    const [cartItems, setCartItems] = useState([9, 9, 20, 12, 11]);
    const [totalPrice, setTotalPrice] = useState(576801714);

    return (
        <div className="container" style={{ maxWidth: 600 }}>
            <div className="row mx-3 my-4">
                <div className="col-12">
                    <Link to="/">Mua thêm sản phẩm khác</Link>
                </div>
            </div>
            <div className={cx('wrapper')}>
                <div className="row mx-0 mb-3">
                    <div className="col-12 py-3">
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => <CartItem key={index} />)
                        ) : (
                            <p>Giỏ hàng của bạn đang trống</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-md-7">
                    Tổng tiền tạm tính (<span id="total-product">{cartItems.length}</span> sản phẩm)
                </div>
                <div className="col-md-5 text-md-end" id="total-money">
                    <span className={cx('total-money')}>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="col-md-12 divider">
                    <hr className="solid" />
                </div>
                <div className="col col-12 text-center">
                    <Button block to="/thanh-toan" type="primary" size="large">
                        Mua ngay
                    </Button>
                </div>
                <div className="col-md-12 text-center" style={{ color: '#62666B' }}>
                    Anh/chị có thể chọn hình thức thanh toán sau khi đặt hàng
                </div>
            </div>
        </div>
    );
}

export default Cart;
