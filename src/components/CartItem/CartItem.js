import classNames from 'classnames/bind';
import styles from './CartItem.module.scss';

import { NumberInput } from '../FormInput';
import { formatCurrency } from '~/utils/utils';
import { Button, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function CartItem({ data, isLoading, onQuantityChange, onRemove }) {
    const handleDecrease = () => {
        if (data.quantity > 1) {
            onQuantityChange(data.productId, data.quantity - 1);
        }
    };

    const handleIncrease = () => {
        onQuantityChange(data.productId, data.quantity + 1);
    };

    const handleRemove = () => {
        onRemove(data.productId);
    };

    return (
        <div className="row">
            <div className="col-md-5 col-12">
                <img src={data.imageUrl} alt={data.name} className="img-fluid" width={520} />
            </div>
            <div className="col-md-7 col-12">
                <div className="row g-2">
                    <div className="col-md-12">
                        <div className={cx('info')}>
                            <h3 className={cx('name')}>{data.name}</h3>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span className={cx('price-current')}>{formatCurrency(data.salePrice)}</span> &nbsp; &nbsp;
                        &nbsp;
                        <span className={cx('price-old')}>{formatCurrency(data.price)}</span> &nbsp; &nbsp; &nbsp;
                        <span className={cx('discount')}>Giảm {data.discountPercentage}%</span>
                    </div>
                    <div className="col-md-12">
                        <div>Chọn số lượng: </div>
                        <Space.Compact>
                            <Button
                                type="default"
                                onClick={handleDecrease}
                                icon={<MinusOutlined />}
                                disabled={data.quantity <= 1 || isLoading}
                            />
                            <NumberInput
                                value={data.quantity}
                                onChange={(value) => onQuantityChange(data.productId, value)}
                                min={1}
                                controls={false}
                                style={{ width: '50px', height: '100%' }}
                                disabled={isLoading}
                            />
                            <Button
                                type="default"
                                onClick={handleIncrease}
                                icon={<PlusOutlined />}
                                disabled={isLoading}
                            />
                        </Space.Compact>
                        <Button type="text" onClick={handleRemove} className="ms-3">
                            Xóa
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
