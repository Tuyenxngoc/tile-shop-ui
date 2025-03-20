import Product from '../Product';

function SlideProduct() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <Product />
                    </div>
                    <div className="col-3">
                        <Product />
                    </div>
                    <div className="col-3">
                        <Product />
                    </div>
                    <div className="col-3">
                        <Product />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SlideProduct;
