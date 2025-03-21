import images from '~/assets';

function Policy() {
    return (
        <div className="container pb-3">
            <div className="row">
                <div className="col-md-3">
                    <img className="img-fluid" src={images.group5} alt="Chính sách khách hàng" />
                </div>
                <div className="col-md-3">
                    <img className="img-fluid" src={images.group6} alt="Chính sách khách hàng" />
                </div>
                <div className="col-md-3">
                    <img className="img-fluid" src={images.group7} alt="Chính sách khách hàng" />
                </div>
                <div className="col-md-3">
                    <img className="img-fluid" src={images.group8} alt="Chính sách khách hàng" />
                </div>
            </div>
        </div>
    );
}

export default Policy;
