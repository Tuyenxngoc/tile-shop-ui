import { useState } from 'react';
import Swal from 'sweetalert2';
import { addToCart } from '~/services/cartService';

const useCart = () => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (productId, quantity = 1) => {
        setIsAdding(true);
        try {
            const payload = {
                productId,
                quantity,
            };

            await addToCart(payload);

            Swal.fire({
                title: 'Thành công!',
                text: 'Sản phẩm đã được thêm vào giỏ hàng.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);

            Swal.fire({
                title: 'Thất bại!',
                text: error.response?.data?.message || 'Không thể thêm vào giỏ hàng.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setIsAdding(false);
        }
    };

    return {
        handleAddToCart,
        isAdding,
    };
};

export default useCart;
