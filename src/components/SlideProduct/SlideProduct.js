import Swal from 'sweetalert2';
import Product from '../Product';

const products = [
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
    {
        name: 'Bồn cầu rời GROHE, thân bồn cầu đặt sàn 2 khối Cube Ceramic 3948400H',
        nameSlug: 'bon-cau-mot-khoi-grohe-39316000',
        image: 'https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg',
        price: 21197455,
        discount: 20,
        salePrice: 16957964,
        rating: 5,
        reviews: 5,
    },
];

function SlideProduct() {
    const handleAddToCart = () => {
        Swal.fire({
            title: 'Thành công!',
            text: 'Sản phẩm đã được thêm vào giỏ hàng.',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    {products.map((product, index) => (
                        <div key={index} className="col">
                            <Product data={product} onAddToCart={handleAddToCart} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SlideProduct;
