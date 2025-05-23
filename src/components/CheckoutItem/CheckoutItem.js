import { Tooltip } from 'antd';
import { formatCurrency } from '~/utils';

function CheckoutItem({ data }) {
    const { imageUrl, name, quantity, salePrice } = data;

    return (
        <div className="d-flex align-items-center border-bottom py-3">
            <img
                src={imageUrl}
                alt={name}
                className="img-thumbnail"
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
            />
            <div className="flex-grow-1 ms-3">
                <Tooltip title={name}>
                    <h5 className="mb-1 text-truncate-2">{name}</h5>
                </Tooltip>
                <small className="text-muted">Số lượng: {quantity}</small>
            </div>
            <div className="text-end fw-semibold ms-3">{formatCurrency(salePrice * quantity)}</div>
        </div>
    );
}

export default CheckoutItem;
