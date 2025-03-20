import { Rate } from 'antd';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

import './test.css';

function Product() {
    return (
        <div className="item-product">
            <div className="hover-mask">
                <a href="https://shome.vn/bon-cau-mot-khoi-grohe-39316000" className="rounded">
                    <img
                        src="https://shome.vn/Thumb/Web/Resources/Uploaded/18/images/bon%20cau/Grohe/bon-cau-grohe-39316000_w255_h255_n.jpg"
                        alt="Bồn cầu một khối Grohe 39316000"
                        className="img-fluid"
                    />
                    <div>
                        <i>
                            <FaSearch />
                        </i>
                    </div>
                </a>
            </div>
            <div className="item-content">
                <a href="/bon-cau-mot-khoi-grohe-39316000" className="link-none link-black col-clear-fix font-15">
                    <h3 className="font-15">Bồn cầu một khối Grohe 39316000</h3>
                </a>
            </div>
            <div className="item-base-price">
                <span className="base-price font-11">21,197,455₫</span>
                <span className="item-sale-off-ratio font-11">(Tiết kiệm: 20%) </span>
            </div>
            <div className="item-sale-price">16,957,964₫</div>
            <div className="item-sale-vote">
                <div className="row">
                    <div className="col-12">
                        <Rate value={5} />
                        <span>(5)</span>
                        <i>
                            <FaShoppingCart />
                        </i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;
