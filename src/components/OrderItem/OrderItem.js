import { formatCurrency } from '~/utils';

function OrderItem({ data }) {
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
                <h5 className="mb-1">{name}</h5>
                <small className="text-muted">Số lượng: {quantity}</small>
            </div>
            <div className="text-end fw-semibold ms-3">{formatCurrency(salePrice * quantity)}</div>
        </div>
    );
}

export default OrderItem;
