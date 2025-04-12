import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '~/components/CartItem';
import Swal from 'sweetalert2';

import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Alert, Button, Empty, Spin, Typography } from 'antd';
import { formatCurrency } from '~/utils/utils';
import { getCartItems, removeCartItem, updateCartItem } from '~/services/cartService';
import images from '~/assets';

const cx = classNames.bind(styles);

function Cart() {
    const navigate = useNavigate();

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);

    const [entityData, setEntityData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [loadingItems, setLoadingItems] = useState([]);

    const handleUpdateQuantity = async (productId, quantity) => {
        if (loadingItems.includes(productId)) return;

        setLoadingItems((prev) => [...prev, productId]);

        try {
            const response = await updateCartItem(productId, quantity);
            if (response.status === 200) {
                const { data } = response.data.data;

                setEntityData((prev) => prev.map((item) => (item.productId === productId ? data : item)));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            Swal.fire('Lỗi', errorMessage, 'error');
        } finally {
            setLoadingItems((prev) => prev.filter((id) => id !== productId));
        }
    };

    const handleRemoveItem = async (productId) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                const response = await removeCartItem(productId);
                if (response.status === 200) {
                    setEntityData((prev) => prev.filter((item) => item.productId !== productId));
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message;
                Swal.fire('Lỗi', errorMessage, 'error');
            }
        }
    };

    const handleCheckout = () => {
        if (entityData?.length > 0) {
            navigate('/thanh-toan');
        } else {
            Swal.fire('Thông báo', 'Giỏ hàng của bạn đang trống.', 'info');
        }
    };

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getCartItems();
                const { data } = response.data;
                setEntityData(data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
                setErrorMessage(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntities();
    }, []);

    useEffect(() => {
        if (entityData && entityData.length > 0) {
            const totalPrice = entityData.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
            const totalProduct = entityData.reduce((acc, item) => acc + item.quantity, 0);

            setTotalPrice(totalPrice);
            setTotalProduct(totalProduct);
        } else {
            setTotalPrice(0);
            setTotalProduct(0);
        }
    }, [entityData]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center w-100">
                <Spin size="large" />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-100">
                <Alert message="Lỗi" description={errorMessage} type="error" />
            </div>
        );
    }

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
                        {entityData.length > 0 ? (
                            entityData.map((item, index) => (
                                <CartItem
                                    key={index}
                                    data={item}
                                    isLoading={loadingItems.includes(item.productId)}
                                    onQuantityChange={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))
                        ) : (
                            <Empty
                                image={images.empty}
                                description={<Typography.Text>Giỏ hàng của bạn đang trống</Typography.Text>}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-md-7">
                    Tổng tiền tạm tính (<span id="total-product">{totalProduct}</span> sản phẩm)
                </div>
                <div className="col-md-5 text-md-end" id="total-money">
                    <span className={cx('total-money')}>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="col-md-12 divider">
                    <hr className="solid" />
                </div>
                <div className="col col-12 text-center">
                    <Button block type="primary" size="large" onClick={handleCheckout}>
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
